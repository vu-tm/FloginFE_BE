package com.flogin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.flogin.dto.LoginResponse;
import com.flogin.dto.UserDto;
import com.flogin.service.AuthService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("Mock: Controller voi mocked service success")
    void testLoginSuccessWithMockedService() throws Exception {
        LoginResponse mockResponse = new LoginResponse(
            true, "Dang nhap thanh cong", "mock-token", new UserDto("testuser", "testuser@example.com")
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"Test@123\"}"))
            .andExpect(status().isOk());

        verify(authService, times(1)).authenticate(any());
    }
    
    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Khong tim thay username")
    void testLoginFailureWithMockedService_usernameNotFound() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Khong tim thay username", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"Test@123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Sai mat khau")
    void testLoginFailureWithMockedService_wrongPassword() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Sai mat khau", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"Test@456\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - username trong")
    void testLoginFailureWithMockedService_emptyUsername() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Username bi bo trong", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"\",\"password\":\"Test@123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Do dai username ngan hon 3 ki tu hoac dai hon 50 ki tu")
    void testLoginFailureWithMockedService_usernameLengthViolation() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Khong tim thay username", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"tes\",\"password\":\"Test@123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - username chua ki tu khong hop le")
    void testLoginFailureWithMockedService_usernameWithInappropriateCharacter() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Khong tim thay username", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"test@user\",\"password\":\"Test@123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Password trong")
    void testLoginFailureWithMockedService_emptyPassword() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Password bi bo trong", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Password ngan hon 6 ki tu hoac dai hon 100 ki tu")
    void testLoginFailureWithMockedService_passwordLengthViolation() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Do dai password khong hop le", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"Te@12\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Password khong chua it nhat 1 chu hoa, 1 chu thuong, 1 so va 1 ki tu dac biet")
    void testLoginFailureWithMockedService_passwordRequirementsViolation() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"Test123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Username chua khoang trang")
    void testLoginFailureWithMockedService_usernameHasWhitespaces() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Username chua khoang trang", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"test user\",\"password\":\"Test@123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }

    @Test
    @DisplayName("Mock: Controller voi mocked service failure - Password chua khoang trang")
    void testLoginFailureWithMockedService_passwordHasWhitespaces() throws Exception {
         LoginResponse mockResponse = new LoginResponse(
            false, "Password chua khoang trang", null, null
        );

        when(authService.authenticate(any())).thenReturn(mockResponse);
        
        mockMvc.perform(post("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"username\":\"testuser\",\"password\":\"Test @123\"}"))
            .andExpect(status().isBadRequest());

        verify(authService, times(1)).authenticate(any());
    }
}
