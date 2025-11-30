package com.flogin.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.flogin.service.JWTTokenFilterService;
import com.flogin.service.TokenService;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public JWTTokenFilterService tokenFilterService(TokenService tokenService) {
        return new JWTTokenFilterService(tokenService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JWTTokenFilterService tokenFilterService)
            throws Exception {
        http

                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:3000")); // frontend origin
                    config.setAllowedHeaders(List.of("*"));
                    String path = request.getRequestURI();
                    if (path.startsWith("/api/login")) {
                        config.setAllowedMethods(List.of("POST"));
                    } else {
                        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    }
                    return config;
                    //Khong su dung cookie de luu token, khong can setAllowCredentials(true)
                }))
                .headers(headers -> headers
                        // HSTS – Strict-Transport-Security (bắt buộc HTTPS)
                        .httpStrictTransportSecurity(hsts -> hsts
                                .maxAgeInSeconds(31536000) // 1 năm
                                .includeSubDomains(true)
                                .preload(true))

                        // X-Content-Type-Options: nosniff
                        .contentTypeOptions(Customizer.withDefaults())
                        // X-Frame-Options: DENY (chặn clickjacking)
                        .frameOptions(frame -> frame.deny())
                        // Content-Security-Policy (rất mạnh, nhưng vẫn cho phép React chạy ngon)
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives(
                                        "default-src 'self'; " +
                                                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
                                                +
                                                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                                "img-src 'self' data: https:; " +
                                                "font-src 'self' https://fonts.gstatic.com; " +
                                                "connect-src 'self' http://localhost:8080 ws://localhost:8080; " +
                                                "frame-ancestors 'none'; " +
                                                "base-uri 'self'; " +
                                                "form-action 'self'; " +
                                                "upgrade-insecure-requests"))

                        // Permissions-Policy (tắt các tính năng nguy hiểm)
                        .permissionsPolicy(permissions -> permissions
                                .policy("camera=(), microphone=(), geolocation=(), payment=()")))

                .exceptionHandling(exception -> exception.authenticationEntryPoint(
                        (request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.getWriter().write(
                                    "{\"error\": \"Unauthorized\", \"message\": \"Token không hợp lệ hoặc đã hết hạn\"}");
                        }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().authenticated())

                .addFilterBefore(tokenFilterService, UsernamePasswordAuthenticationFilter.class);
        // .headers(headers -> headers.frameOptions().sameOrigin());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}