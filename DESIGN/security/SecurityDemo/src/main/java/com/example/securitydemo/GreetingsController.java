package com.example.securitydemo;

import jwt.JwtUtils;
import jwt.LoginRequest;
import jwt.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;
import org.springframework.security.core.Authentication;
import java.util.HashMap;
import java.util.Map;
@RestController
@EnableWebSecurity
//그래야지 preAuthorize를 사용할 수 있음
@EnableMethodSecurity
public class GreetingsController {



    private final AuthenticationManager authenticationManager;
    @Autowired
    public GreetingsController(@Lazy AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    @Autowired
    private  JwtUtils jwtUtils;


    @GetMapping("/hello")
    public static String main(String[] args) {
        return "Hello, World!";
    }

    //check user credentials before acting on method
    @PreAuthorize("hasRole('ADMIN')or hasRole('USER')")
    @GetMapping("/user")
    public String userEndPoint() {
        return "Hello User!";
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminEndPoint() {
        return "Hello admin!";
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        //FIRST trying authentication
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate
                    (new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        //SECOND (if valid) set user context
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        //THIRD generate jwtToken using user context
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        //FOURTH get roles (제거 가능)
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        //FIFTH (with userdetail, jwtToken, roles)
        LoginResponse response = new LoginResponse(userDetails.getUsername(), jwtToken, roles);

        return ResponseEntity.ok(response);
    }

    //after login
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", userDetails.getUsername());
        profile.put("roles", userDetails.getAuthorities()
                .stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList()));
        profile.put("message", "this is user specific content from backend");
        return ResponseEntity.ok(profile);
    }
}
