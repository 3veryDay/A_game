package com.example.securitydemo;

import jwt.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    DataSource dataSource;
    @Autowired
    PasswordEncoder passwordEncoder;
    @PostMapping("/users/signup")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/users")
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


