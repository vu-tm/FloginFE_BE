package com.flogin.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") //Chỉ cho phép URL này kêu API
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
            this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try
        {
            LoginResponse response = authService.authenticate(request);
            if (
                response.getMessage() == "Khong tim thay username" ||
                response.getMessage() == "Sai mat khau" ||
                response.getMessage() == "Username bi bo trong" ||
                response.getMessage() == "Do dai username khong hop le" ||
                response.getMessage() == "Username chua ki tu khong hop le" ||
                response.getMessage() == "Username chua khoang trang" ||
                response.getMessage() == "Password bi bo trong" ||
                response.getMessage() == "Do dai password khong hop le" ||
                response.getMessage() == "Password phai co ca chu va so" ||
                response.getMessage() == "Password chua khoang trang"
            )
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                
            return ResponseEntity.ok().header("Authorization", "Bearer " + response.getToken()).body(response);
        }
        catch (RuntimeException e)
        { 
            LoginResponse response = new LoginResponse(false, e.getMessage(), null, null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}