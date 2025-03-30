package jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//Spring manager Component, life cycle
@Component//class that makes sure that this filter executes only once per request
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("AuthTokenFilter called for URI : {}", request.getRequestURI());
        String path = request.getRequestURI();
        if (path.contains("/login") || path.equals("/signup")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            //extract the JWT token
            String jwt = parseJwt(request);
            System.out.println("JWT from header : " + jwt);
            //비지 않고, 유효하다면
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                //username extract
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                //load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                //authentication
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails,
                                null,
                                //ROLES (such as "ADMIN", "USER")
                                userDetails.getAuthorities());
                logger.debug("Roles from JWT: {}", userDetails.getAuthorities());

                //enhance the security context using the authentication object(session id)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //setting security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }
    private String parseJwt(HttpServletRequest request) {
        String jwt = jwtUtils.getJwtFromHeader(request);
        logger.debug("AuthTokenFilter.jave : {}", jwt);
        return jwt;
    }

}
