package com.example.agame.Controller;

import com.example.agame.Model.AppUser;
import com.example.agame.Model.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    @Autowired
    private UserRepository userRepository;
    @PostMapping(value = "/req/signup", consumes = "application/json", produces = "application/json")
    public AppUser createUser(@RequestBody AppUser user){
        return userRepository.save(user);
    }
}
