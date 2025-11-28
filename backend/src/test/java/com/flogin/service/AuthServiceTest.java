package com.flogin.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;


@SpringBootTest
@DisplayName("Login Service Unit Tests")
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("TC1: Login thanh cong voi credentials hop le")
    void testLoginSuccess()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", "Test@123"
        );
        
        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
        assertEquals("Dang nhap thanh cong", response.getMessage());    
        assertNotNull(response.getToken());
        assertNotNull(response.getUser());
    }

    @Test
    @DisplayName("TC2: Login that bai voi username sai")
    void testLoginFailure_usernameNotFound()
    {
        LoginRequest request = new LoginRequest(
            "wronguser", "Test@123"
        );

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.authenticate(request));
        assertEquals("Khong tim thay username", exception.getMessage());
    }

    @Test
    @DisplayName("TC3: Login that bai voi password sai")
    void testLoginFailure_wrongPassword()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", "Test@456"
        );

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Sai mat khau", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC4: Login that bai voi username bo trong")
    void testLoginFailure_emptyUsername()
    { 
        LoginRequest request = new LoginRequest(
            "", "Test123"
        );

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Username bi bo trong", response.getMessage()); 
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC5: Login that bai voi username ngan hon 3 ki tu")
    void testLoginFailure_usernameShorterThan3Chars()
    {
        LoginRequest request = new LoginRequest(
            "te", "Test123");
            
        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Do dai username khong hop le", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC6: Login that bai voi username dai hon 50 ki tu")
    void testLoginFailure_usernameLongerThan50Chars()
    {
        LoginRequest request = new LoginRequest(
            "longusername_for_testing_purposes_exceeding_fifty_chars", "Test123");

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Do dai username khong hop le", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC7: Login that bai voi username chua ki tu khong hop le")
    void testLoginFailure_usernameWithInappropriateChars()
    { 
        LoginRequest request = new LoginRequest(
            "test@user", "Test123"
        );
        
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Username chua ki tu khong hop le", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC8: Login that bai voi password bo trong")
    void testLoginFailure_emptyPassword()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", ""
        );

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Password bi bo trong", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC9:Login that bai voi password ngan hon 6 ki tu")
    void testLoginFailure_passwordShorterThan6Chars()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", "Test"
        );

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Do dai password khong hop le", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC10: Login that bai voi password dai hon 100 ki tu")
    void testLoginFailure_passwordLongerThan100Chars()
    {
        String testPassword = "a".repeat(101);
        LoginRequest request = new LoginRequest(
            "testusername", testPassword
        );

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Do dai password khong hop le", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC11: Login that bai voi password thieu chu hoa")
    void testLoginFailure_passwordMissingCapitalLetters()
    {
        LoginRequest request = new LoginRequest(
            "testuser", "test@123"
        );

        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC12: Login that bai voi password thieu chu thuong")
    void testLoginFailure_passwordMissingNormalLetters()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", "TEST@123"
        );
        
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC13: Login that bai voi password thieu so")
    void testLoginFailure_passwordMissingNumbers()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", "Test@test"
        );
        
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC14: Login that bai voi password thieu so")
    void testLoginFailure_passwordMissingSpecialCharacters()
    { 
        LoginRequest request = new LoginRequest(
            "testuser", "Test123"
        );
        
        LoginResponse response = authService.authenticate(request);
        
        assertFalse(response.isSuccess());
        assertEquals("Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC15: Login that bai voi password co khoang trang")
    void testLoginFailure_passwordHasWhitespaces()
    {
        LoginRequest request = new LoginRequest(
            "testuser", "Test@ 123"
        );

        LoginResponse response = authService.authenticate(request);
         
        assertFalse(response.isSuccess());
        assertEquals("Password chua khoang trang", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }

    @Test
    @DisplayName("TC16: Login that bai voi username co khoang trang")
    void testLoginFailure_usernameHasWhitespaces()
    {
        LoginRequest request = new LoginRequest(
            "test user", "Test@123"
        );

        LoginResponse response = authService.authenticate(request);
         
        assertFalse(response.isSuccess());
        assertEquals("Username chua ki tu khong hop le", response.getMessage());
        assertNull(response.getToken());
        assertNull(response.getUser());
    }
}
