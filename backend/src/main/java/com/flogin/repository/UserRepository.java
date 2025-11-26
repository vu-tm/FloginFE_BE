package com.flogin.repository;

import com.flogin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
        // Lấy các method save, findById, findAll, deleteById...
}