package com.example.securitydemo;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;

@RestController
@EnableWebSecurity
//그래야지 preAuthorize를 사용할 수 있음
@EnableMethodSecurity
public class GreetingsController {

    @GetMapping("/hello")
    public static String main(String[] args) {
        return "Hello, World!";
    }
//check user credentials before acting on method
    @PreAuthorize("hasRole('ADMIN')or hasRole('USER')")
    @GetMapping("/user")
    public String userEndPoint(){
        return "Hello User!";
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminEndPoint(){
        return "Hello admin!";
    }
}
