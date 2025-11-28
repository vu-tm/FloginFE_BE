package com.flogin.controller;

import org.springframework.http.HttpStatus;
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
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
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
            if (!response.isSuccess())
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