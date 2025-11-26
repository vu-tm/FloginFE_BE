package com.flogin.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JWTTokenFilterService filterService;

    public SecurityConfig(JWTTokenFilterService filterService) {
        this.filterService = filterService;
    }

    //Validate token moi khi call api
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/api/auth/login").permitAll() //Khong check authorization cho login va h2-console
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().authenticated()) //Check authorization cac api con lai
                .addFilterBefore(filterService, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions().sameOrigin());
        return http.build();
    }

     
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

    @Bean
    public JWTTokenFilterService tokenFilterService(TokenService tokenService) {
        return new JWTTokenFilterService(tokenService);
    }
}