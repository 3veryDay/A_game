package com.example.mvp_agame_spring;

// src/main/java/your/package/config/WebConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

/*
.allowedOrigins("https://your-frontend.com") // 정확한 도메인 지정
.allowedMethods("GET", "POST") // 정말 필요한 메서드만
.allowedHeaders("Content-Type", "Authorization") // 필요한 헤더만
.addMapping("/api/**") // API 경로만 허용
 */