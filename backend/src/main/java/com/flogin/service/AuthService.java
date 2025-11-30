package com.flogin.service;

import com.flogin.dto.UserDto;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, TokenService tokenService, PasswordEncoder passwordEncoder)
    { 
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse authenticate(LoginRequest request)
    { 
        //Validate username
        if (request.getUsername() == "")
            return new LoginResponse(false, "Username bi bo trong", null, null);
        if (request.getUsername().length() < 3 || request.getUsername().length() > 50)
            return new LoginResponse(false, "Do dai username khong hop le", null, null);
        if (!request.getUsername().matches("^[a-zA-Z0-9\\-._]+$"))
            return new LoginResponse(false, "Username chua ki tu khong hop le", null, null);
        
        //Validate password
        if (request.getPassword() == "")
            return new LoginResponse(false, "Password bi bo trong", null, null);
        if (request.getPassword().length() < 6 || request.getPassword().length() > 100)
            return new LoginResponse(false, "Do dai password khong hop le", null, null);
        if (!request.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-])[\\S]+$"))
            return new LoginResponse(false, "Password phai chua it nhat 1 chu cai hoa, 1 chu cai thuong, 1 so va 1 ki tu dac biet va khong chua khoang trang", null, null);

        //Truy xuất database
        User user = userRepository.findById(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Khong tim thay username"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) { 
            return new LoginResponse(true, "Dang nhap thanh cong", tokenService.generateToken(user), new UserDto(user.getUsername(), user.getEmail()));
        }
        return new LoginResponse(false, "Sai mat khau", null, null);           
    }
}
