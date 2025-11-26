package com.flogin.service;

import com.flogin.entity.User;

import java.util.Date;
import java.security.Key;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
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

	public String getUsernameFromToken(String token){
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}
	
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token);
			return true;
		} catch (Exception ex) {
			throw new AuthenticationCredentialsNotFoundException("Token het han hoac sai",ex.fillInStackTrace());
		}
	}
}
