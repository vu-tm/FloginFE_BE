package com.flogin.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

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
                .cors(cors -> cors.configurationSource(request -> {
                            CorsConfiguration config = new CorsConfiguration();
                            config.setAllowedOrigins(List.of("http://localhost:3000")); // frontend origin
                            config.setAllowedHeaders(List.of("*"));

                            String path = request.getRequestURI();

                            if (path.startsWith("/api/login")) {
                                // AuthController: Cho phep post va options cho preflight
                                config.setAllowedMethods(List.of("POST"));
                            } else {
                                // ProductController: cho phep moi methods va preflight
                                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                            }
                            return config;
                        }))
                .csrf(csrf -> csrf
                .disable())
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/api/login").permitAll() //Khong check authorization cho login va h2-console
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
}