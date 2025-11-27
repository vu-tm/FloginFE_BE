package com.flogin.controller;

// import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;

import java.util.*;

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

        // CREATE - Tạo sản phẩm mới
        @PostMapping
        public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
                return new ResponseEntity<>(productService.createProduct(productDto), null, HttpStatus.CREATED);
        }

        // READ ALL - Lấy tât cả sản phẩm
        @GetMapping
        public ResponseEntity<List<ProductDto>> getAllProducts() {
                return new ResponseEntity<>(productService.getAllProducts(), null, HttpStatus.OK);
        }

        // READ ONE - Lấy sản phẩm theo ID
        @GetMapping("/{id}")
        public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
                return new ResponseEntity<>(productService.getProduct(id), null, HttpStatus.OK);
        }

        // UPDATE - Cập nhập sản phẩm
        @PutMapping("/{id}")
        public ResponseEntity<ProductDto> updateProduct(
                        @PathVariable Long id,
                        @RequestBody ProductDto productDto) {
                return new ResponseEntity<>(productService.updateProduct(id, productDto), null, HttpStatus.OK);
        }

        // DELTE - Xoá sản phẩm
        @DeleteMapping("/{id}")
        public ResponseEntity<ProductDto> deleteProduct(@PathVariable Long id) {
                productService.deleteProduct(id);
                return new ResponseEntity<>(null, null, HttpStatus.NO_CONTENT);
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
