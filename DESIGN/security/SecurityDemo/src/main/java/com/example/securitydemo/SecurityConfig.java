package com.example.securitydemo;

import jwt.AuthEntryPointJwt;
import jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.method.AuthorizeReturnObject;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.sql.DataSource;

import static org.springframework.security.config.Customizer.withDefaults;

//annotation tells spring to be application context
@Configuration
//gives the ability to desing(configure) the security of the web application
@EnableWebSecurity
public class SecurityConfig {

    //injecting the datasource bean, spring will provide the object
    //how ? -> spring has all info about configurations, with the context, spring will provide the database bean
    @Autowired
    DataSource dataSource;
    //create to handle unauthorized requests
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;
    //filter type will check header
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter(){
        return new AuthTokenFilter();
    }

    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorizeRequests ->
                authorizeRequests.requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/signin").permitAll()
                        //이거 말고는 다 인증을 해야함
                .anyRequest().authenticated());
        //REST API, stateless
        http.sessionManagement (
                session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS)
                        );
        //custom handler를 authenticationEntryPoint을 더해서, unauthorizedHandler를 사용하겠다.
        http.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler));
        http.headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin())
                );
        http.csrf(csrf->csrf.disable());
        http.addFilterBefore(authenticationJwtTokenFilter(),
                            UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }
    //to ignore the default bean in SrpingbottWebSecurityConfiguration
    //mark as bean
//    @Bean
//    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
//        //permit all requests to /h2-console withcout security filter chain acting upon it
//        http.authorizeHttpRequests((requests) -> requests.requestMatchers("/h2-console/**").permitAll()
//                //any request should be authenticated (default behavior)
//                .anyRequest().authenticated());
//        //no more cookie! (stateless)
//        http.sessionManagement(session
//                ->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//        //basic, spring security should use basic http authentication
////        http.formLogin(withDefaults());
//        http.httpBasic(withDefaults());
//        //returning the object
//
//        //
//        http.headers(headers->
//                headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));
//
//        //계속 h2-console이 안 들어가지는 걸 막기 위해서 csrf를 disable
//        http.csrf(csrf ->  csrf.disable());
//        return http.build();
//        //securityFilterChain Object is being returned
//    }

    //Authentication Provider처럼 PasswordEncoder랑 userDetailsService를 사용해서 AUthenticate 하는 인터페이스 임.

    @Bean
    public UserDetailsService userDetailsService() {
        //object of userDetails, construct the object
        //not hardcoded, {noop} is a prefix that tells DelegatingPasswordEncoder that the password is not encoded
        UserDetails admin = User.withUsername("admin")
                //{noop} is to tell encoder that the password is not encoded
                .password(passwordEncoder().encode("adminPass"))
                .roles("ADMIN")
                .build();


        UserDetails user1 = User.withUsername("user1")
                //개발을 위해서 암호화 생략 {noop}
                //DB에 저장할 때, password을 encrypt 해서 저장해야 함.
                .password(passwordEncoder().encode("password1"))
                .roles("USER")
                .build();
        //return 안에 넣어서 객체를 생성
        //return new InMemoryUserDetailsManager(user1, admin);
        //create users in a database


        //use Database to store users, but tables need to be produced before!
        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager(dataSource);
        userDetailsManager.createUser(user1);
        userDetailsManager.createUser(admin);
        return userDetailsManager;

    }
    //interface for encoding passwords ( most preferred is BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        //returning instance of encoder
        //this is inbuilt, if you want to change the algorithm, you insert the algorithm
        return new BCryptPasswordEncoder();
        //authomatically, Salt is generated
    }

    @Bean
    public AuthenticationManager authenticationmanager(AuthenticationConfiguration builder)
    throws Exception{
        return builder.getAuthenticationManager();
    }

}
