package com.flogin.service;

import com.flogin.entity.User;

import java.util.Date;
import java.security.Key;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

//Khởi tạo token cho session đăng nhập
@Service
public class TokenService {
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public String generateToken(User user) {
		String username = user.getUsername();
		Date currentDate = new Date();
		Date expireDate = new Date(currentDate.getTime() + 900000);
		
		String token = Jwts.builder()
				.setSubject(username)
				.setIssuedAt( new Date())
				.setExpiration(expireDate)
				.signWith(key,SignatureAlgorithm.HS256)
				.compact();
		System.out.println("New token :");
		System.out.println(token);
		return token;
	}
}
