package com.flogin.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.flogin.service.JWTTokenFilterService;
import com.flogin.service.TokenService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    //Validate token moi khi call api
    
    @Bean
    public JWTTokenFilterService tokenFilterService(TokenService tokenService) {
        return new JWTTokenFilterService(tokenService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JWTTokenFilterService tokenFilterService) throws Exception {
        http
                .csrf(csrf -> csrf
                .disable())
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/api/auth/login").permitAll() //Khong check authorization cho login va h2-console
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().authenticated()) //Check authorization cac api con lai
                .addFilterBefore(tokenFilterService, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions().sameOrigin());
        return http.build();
    }

     
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry)
            {
                registry.addMapping("/api/auth").allowedOrigins("http://localhost:3000");
            }
        };
    }
}