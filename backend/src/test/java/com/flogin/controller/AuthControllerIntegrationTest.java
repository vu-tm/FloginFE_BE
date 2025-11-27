package com.flogin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.dto.UserDto;
import com.flogin.service.AuthService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Login API Integration Tests")
public class AuthControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName ("POST /api/auth/login - Thanh cong")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true,
            "Dang nhap thanh cong",
            "token123",
            new UserDto("testuser", "testuser@example.com")
        );

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
                    .andExpect(jsonPath("$.user").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do username khong ton tai")
    void testLoginFailure_usernameNotFound() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Khong tim thay username", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Khong tim thay username"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do sai mat khau")
    void testLoginFailure_wrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Sai mat khau", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Sai mat khau"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do username trong")
    void testLoginFailure_emptyUsername() throws Exception {
        LoginRequest request = new LoginRequest("", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Username bi bo trong", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Username bi bo trong"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do username ngan hon 3 ki tu")
    void testLoginFailure_usernameShorterThan3Chars() throws Exception {
        LoginRequest request = new LoginRequest("te", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Do dai username khong hop le", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Do dai username khong hop le"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do username dai hon 50 ki tu")
    void testLoginFailure_usernameLongerThan50Chars() throws Exception {
        LoginRequest request = new LoginRequest("longusername_for_testing_purposes_exceeding_fifty_chars", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Do dai username khong hop le", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Do dai username khong hop le"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do username chua ki tu khong hop le")
    void testLoginFailure_usernameWithInappropriateChars() throws Exception{
        LoginRequest request = new LoginRequest("test@user", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Username chua ki tu khong hop le", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Username chua ki tu khong hop le"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do mat khau trong")
    void testLoginFailure_emptyPassword() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Password bi bo trong", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Password bi bo trong"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do mat khau ngan hon 6 ki tu")
    void testLoginFailure_passwordShorterThan6Chars() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test1");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Do dai password khong hop le", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Do dai password khong hop le"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do mat khau dai hon 100 ki tu")
    void testLoginFailure_passwordLongerThan100Chars() throws Exception {
        String password = "a".repeat(101);
        LoginRequest request = new LoginRequest("testuser", password);
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Do dai password khong hop le", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Do dai password khong hop le"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do mat khau chi co chu")
    void testLoginFailure_passwordOnlyHasLetters() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do mat khau chi co so")
    void testLoginFailure_passwordOnlyHasNumbers() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "1231231");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do username co khoang trang")
    void testLoginFailure_usernameHasWhitespaces() throws Exception {
        LoginRequest request = new LoginRequest("test user", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Username chua khoang trang", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Username chua khoang trang"))
                    .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do password co khoang trang")
    void testLoginFailure_passwordHasWhitespaces() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test 123");
        LoginResponse mockResponse = new LoginResponse(
            false, 
            "Password chua khoang trang", 
            null,
            null
        );

        when (authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))

                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.token").doesNotExist())
                    .andExpect(jsonPath("$.message").value("Password chua khoang trang"))
                    .andExpect(jsonPath("$.user").doesNotExist());

    }

    private final String ALLOWED_ORIGIN = "http://localhost:3000";
    private final String DIS_ALLOWED_ORIGIN = "http://notallowed.com";

    //Test preflight de kiem tra cac cai dat CORS da duoc ghi nhan chua
    @Test
    @DisplayName("CORS Test Preflight AllowedOrigin")
    void testPreflightAllowedOrigin() throws Exception {
       mockMvc.perform(options("/api/login")
                .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGIN))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "POST"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    @Test
    @DisplayName("CORS Test Preflight DisallowedOrigin")
    void testPreflightDisallowedOrigin() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header(HttpHeaders.ORIGIN, DIS_ALLOWED_ORIGIN)
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type"))
                .andExpect(status().isForbidden());
    }

    //Test POST request voi CORS
    @Test
    @DisplayName("POST CORS AllowedOrigin")
    void testPostAllowedOrigin() throws Exception {
        when (authService.authenticate(any(LoginRequest.class))).thenReturn(
            new LoginResponse(true, "Dang nhap thanh cong", "mock-token-123", new UserDto("testuser", "testuser@example.com")
        ));

        mockMvc.perform(post("/api/auth/login")
                .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"Test123\"}"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGIN));
    }

    @Test
    @DisplayName("POST CORS DisallowedOrigin")
    void testPostDisallowedOrigin() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .header(HttpHeaders.ORIGIN, DIS_ALLOWED_ORIGIN)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"Test123\"}"))
                .andExpect(status().isForbidden());
    }
}