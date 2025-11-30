package com.flogin.controller;

// import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;

import jakarta.validation.Valid;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products") // GET /api/products
@CrossOrigin(origins = "*") // Cho phép tất cả domain truy cập
public class ProductController {

        private final ProductService productService;

        public ProductController(ProductService productService) {
                this.productService = productService;
        }

        // ========================================================================
        // ResponseEntity<T> response = new ResponseEntity<>(body, headers, status);
        // Status code: 200 = OK, 201 = CREATED, 404 = NOT FOUND, 400 = BAD REQUEST,
        // 204 = NO CONTENT(Request successful, no response body)
        // @RequestBody -> Post / Put
        // ========================================================================

        /// CREATE - Tạo sản phẩm mới
        @PostMapping
        public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDto productDto,
                        BindingResult bindingResult) {
                // Kiểm tra lỗi validation
                if (bindingResult.hasErrors()) {
                        Map<String, String> errors = bindingResult.getFieldErrors()
                                        .stream()
                                        .collect(Collectors.toMap(
                                                        FieldError::getField,
                                                        FieldError::getDefaultMessage));
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
                }

                try {
                        ProductDto createdProduct = productService.createProduct(productDto);
                        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(Map.of("error", e.getMessage()));
                }
        }

        // READ ALL - Lấy tất cả sản phẩm
        @GetMapping
        public ResponseEntity<List<ProductDto>> getAllProducts() {
                try {
                        List<ProductDto> products = productService.getAllProducts();
                        return new ResponseEntity<>(products, HttpStatus.OK);
                } catch (Exception e) {
                        return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }

        // READ ONE - Lấy sản phẩm theo ID
        @GetMapping("/{id}")
        public ResponseEntity<?> getProductById(@PathVariable Long id) {
                try {
                        ProductDto product = productService.getProduct(id);
                        return new ResponseEntity<>(product, HttpStatus.OK);
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(Map.of("error", e.getMessage()));
                }
        }

        // UPDATE - Cập nhật sản phẩm
        @PutMapping("/{id}")
        public ResponseEntity<?> updateProduct(
                        @PathVariable Long id,
                        @Valid @RequestBody ProductDto productDto,
                        BindingResult bindingResult) {

                // Kiểm tra lỗi validation
                if (bindingResult.hasErrors()) {
                        Map<String, String> errors = bindingResult.getFieldErrors()
                                        .stream()
                                        .collect(Collectors.toMap(
                                                        FieldError::getField,
                                                        FieldError::getDefaultMessage));
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
                }

                try {
                        ProductDto updatedProduct = productService.updateProduct(id, productDto);
                        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(Map.of("error", e.getMessage()));
                }
        }

        // DELETE - Xóa sản phẩm
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
                try {
                        productService.deleteProduct(id);
                        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } catch (RuntimeException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(Map.of("error", e.getMessage()));
                }
        }

        // // READ ALL - Lấy tât cả sản phẩm với phân trang
        // @GetMapping("/paged")
        // public ResponseEntity<Page<ProductDto>> getAllProductsWithPagination(
        // @RequestParam(defaultValue = "0") int page,
        // @RequestParam(defaultValue = "10") int size) {
        // return new ResponseEntity<>(productService.getAllProductsWithPagination(page,
        // size), null, HttpStatus.OK);
        // }
}
