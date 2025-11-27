package com.flogin.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    
    @Id //Tên đăng nhập là duy nhất, sử dụng làm khóa chính
    private String username;
    private String password;
    private String email;

    public User() {
    }

    public User(String username, String password, String email)
    { 
        this.username = username;
        this.password = password;
        this.email = email;
    }
     
    public String getUsername()
    { 
        return username;
    }

    public String getPassword()
    {
        return password;
    }

    public String getEmail()
    {
        return email;
    }
}
