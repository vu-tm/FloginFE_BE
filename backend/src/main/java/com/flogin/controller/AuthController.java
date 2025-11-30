package com.flogin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
            BindingResult bindingResult) {
        // Kiểm tra lỗi validate
        if (bindingResult.hasErrors()) {
            String message = bindingResult.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage) // Lấy message từ annotation
                    .findFirst() // Lấy lỗi đầu tiên
                    .orElse("Dữ liệu đầu vào không hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new LoginResponse(false, message, null, null));
        }

        // Xử lý đăng nhập
        try {
            LoginResponse response = authService.authenticate(request);
            if (!response.isSuccess())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

            return ResponseEntity.ok().header("Authorization", "Bearer " + response.getToken()).body(response);
        } catch (RuntimeException e) {
            LoginResponse response = new LoginResponse(false, e.getMessage(), null, null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}