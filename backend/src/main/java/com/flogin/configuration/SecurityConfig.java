package com.flogin.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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

                .addFilterBefore(tokenFilterService, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions().sameOrigin());

        return http.build();
    }

    // 4. CORS config chuẩn dev + production (Vercel/Netlify)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*", // dev tất cả port
                "http://127.0.0.1:*",
                "https://*.vercel.app", // khi deploy frontend
                "https://*.netlify.app",
                "https://flogin-fe-be.vercel.app" // tên dự án của bạn (nếu có)
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // BẮT BUỘC để gửi cookie/token

        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // 5. Password hashing BCrypt – đã có, giữ nguyên
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}