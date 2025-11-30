package com.flogin.configuration;

import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class HeaderCsrfTokenRepository implements CsrfTokenRepository {

    private static final String HEADER_NAME = "X-CSRF-TOKEN";

    @Override
    public CsrfToken generateToken(HttpServletRequest request) {
        String token = java.util.UUID.randomUUID().toString();
        return new CsrfToken() {
            @Override
            public String getHeaderName() {
                return HEADER_NAME;
            }

            @Override
            public String getParameterName() {
                return "_csrf";
            }

            @Override
            public String getToken() {
                return token;
            }
        };
    }

    @Override
    public void saveToken(CsrfToken token, HttpServletRequest request, HttpServletResponse response) {
        // Không dùng cookie, frontend tự lưu token (localStorage)
    }

    @Override
    public CsrfToken loadToken(HttpServletRequest request) {
        String token = request.getHeader(HEADER_NAME);
        if (token != null) {
            return new org.springframework.security.web.csrf.DefaultCsrfToken(HEADER_NAME, "_csrf", token);
        }
        return null;
    }
}
