package com.flogin.repository;

import com.flogin.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Lấy các method save, findById, findAll, deleteById...

    // Kiểm tra tên đã tồn tại
    boolean existsByName(String name);

    // Kiểm tra tên đã tồn tại, ngoại trừ product có id cho trước
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.name = :name AND p.id != :excludeId")
    boolean existsByNameAndIdNot(@Param("name") String name, @Param("excludeId") Long excludeId);
}