package com.example.securitydemo;

import jwt.JwtUtils;
import jwt.LoginRequest;
import jwt.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    DataSource dataSource;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signup")
    public String signUp(@RequestBody LoginRequest loginRequest) {
        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);
        if (userDetailsManager.userExists(loginRequest.getUsername())) {
            return "User already exists";
        }
        UserDetails user = org.springframework.security.core.userdetails.User.withUsername(loginRequest.getUsername())
                .password(passwordEncoder.encode(loginRequest.getPassword()))
                .roles("USER")
                .build();
        userDetailsManager.createUser(user);
        return user.getUsername() + "User created Successfully";

    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
//            Authentication authentication
//                    = new UsernamePasswordAuthenticationToken(
//                            loginRequest.getUsername(), loginRequest.getPassword());
//            System.out.println("Authentication: " + authentication);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword())
            );

        }catch (AuthenticationException e ) {
            return ResponseEntity.badRequest().body("Invalid username or password");
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


    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/createUser")
    public String createUser(@RequestParam String username,
                             @RequestParam String password,
                             @RequestParam String role) {

        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);

        if (userDetailsManager.userExists(username)) {
            return "User already exists";
        }
            UserDetails user = User.withUsername(username)
                    .password(passwordEncoder.encode(password))
                    .roles(role)
                    .build();
        userDetailsManager.createUser(user);
        return "User created Successfully";
        }
    }


