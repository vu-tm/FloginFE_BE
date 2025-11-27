package com.flogin.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;

// Mẫu DTO -> Mock Repository -> Gọi Service
@DisplayName("Product Service Unit Tests")
public class ProductServiceTest {
        @Mock // Tạo mock object
        private ProductRepository productRepository;

        @InjectMocks
        private ProductService productService; // Chèn mock vào ProductService

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);
        }

        @Test
        @DisplayName("TC1: Tạo sản phẩm mới thành công")
        void testCreateProduct() {
                // Dữ liệu đầu vào
                ProductDto productDto = new ProductDto(
                                "Laptop", 15000000, 10, "Electronics");
                // Kết quả mong đợi khi lưu vào database
                Product product = new Product(
                                1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.save(any(Product.class)))
                                .thenReturn(product);

                ProductDto result = productService.createProduct(productDto);

                assertNotNull(result);
                assertEquals("Laptop", result.getName());
                assertEquals(15000000, result.getPrice());
                assertEquals(10, result.getQuantity());
                assertEquals("Electronics", result.getCategory());

                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC2: Lấy sản phẩm theo ID thành công")
        void testGetProduct() {
                Product product = new Product(
                                1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.findById(1L))
                                .thenReturn(Optional.of(product));

                ProductDto result = productService.getProduct(1L);

                assertNotNull(result);
                assertEquals(1L, result.getId());
                assertEquals("Laptop", result.getName());
                assertEquals(15000000, result.getPrice());
                assertEquals(10, result.getQuantity());
                assertEquals("Electronics", result.getCategory());

                verify(productRepository, times(1)).findById(1L);
        }

        @Test
        @DisplayName("TC3: Cập nhật sản phẩm thành công")
        void testUpdateProduct() {
                ProductDto productDto = new ProductDto(
                                "Laptop Pro", 20000000, 12, "Electronics");
                Product existingProduct = new Product(
                                1L, "Laptop", 15000000, 10, "Electronics");
                Product updatedProduct = new Product(
                                1L, "Laptop Pro", 20000000, 12, "Electronics");

                when(productRepository.findById(1L))
                                .thenReturn(Optional.of(existingProduct));
                when(productRepository.save(any(Product.class)))
                                .thenReturn(updatedProduct);

                ProductDto result = productService.updateProduct(1L, productDto);

                assertNotNull(result);
                assertEquals("Laptop Pro", result.getName());
                assertEquals(20000000, result.getPrice());
                assertEquals(12, result.getQuantity());
                assertEquals("Electronics", result.getCategory());

                verify(productRepository, times(1)).findById(1L);
                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC4: Xóa sản phẩm thành công")
        void testDeleteProduct() {
                Product product = new Product(
                                1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.findById(1L))
                                .thenReturn(Optional.of(product));

                productService.deleteProduct(1L);

                verify(productRepository, times(1)).findById(1L);
                verify(productRepository, times(1)).delete(product);
        }

        @Test
        @DisplayName("TC5: Lấy tất cả sản phẩm với phân trang")
        void testGetAllProductsWithPagination() {
                List<Product> products = Arrays.asList(
                                new Product(1L, "Laptop", 15000000, 10, "Electronics"),
                                new Product(2L, "Mouse", 390000, 40, "Electronics"),
                                new Product(3L, "Headphones", 1290000, 10, "Electronics"));

                Pageable pageable = PageRequest.of(0, 2); // page 0, size 2
                Page<Product> productPage = new PageImpl<>(
                                products.subList(0, 2), // Lấy 2 sp đầu
                                pageable,
                                products.size() // Tổng số phần tử
                );

                when(productRepository.findAll(any(Pageable.class)))
                                .thenReturn(productPage);

                Page<ProductDto> result = productService.getAllProductsWithPagination(0, 2);

                // Verify kết quả
                assertNotNull(result);
                assertEquals(2, result.getContent().size()); // Có 2 sản phẩm trong trang
                assertEquals(3, result.getTotalElements()); // Tổng 3 sản phẩm
                assertEquals(2, result.getTotalPages()); // Có 2 trang (3 sản phẩm / 2 per page)
                assertEquals(0, result.getNumber()); // Đang ở trang 0

                // Verify nội dung sản phẩm đầu tiên
                ProductDto firstProduct = result.getContent().get(0);
                assertEquals("Laptop", firstProduct.getName());
                assertEquals(15000000, firstProduct.getPrice());
                assertEquals(10, firstProduct.getQuantity());
                assertEquals("Electronics", firstProduct.getCategory());

                // 6. Verify repository được gọi đúng
                verify(productRepository, times(1)).findAll(any(Pageable.class));
        }

        @Test
        @DisplayName("TC6: Lấy sản phẩm không tồn tại")
        void testGetProduct_notFound() {
                when(productRepository.findById(999L)).thenReturn(Optional.empty());

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.getProduct(999L);
                });

                assertEquals("Product not found with id: 999", exception.getMessage());
                verify(productRepository, times(1)).findById(999L);
        }

        @Test
        @DisplayName("TC7: Cập nhật sản phẩm không tồn tại")
        void testUpdateProduct_notFound() {
                ProductDto productDto = new ProductDto("Laptop Pro", 20000000, 12, "Electronics");

                when(productRepository.findById(999L)).thenReturn(Optional.empty());

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.updateProduct(999L, productDto);
                });

                assertEquals("Product not found with id: 999", exception.getMessage());
                verify(productRepository, times(1)).findById(999L);
                verify(productRepository, never()).save(any()); // không được gọi save
        }

        @Test
        @DisplayName("TC8: Xóa sản phẩm không tồn tại")
        void testDeleteProduct_notFound() {
                when(productRepository.findById(999L)).thenReturn(Optional.empty());

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.deleteProduct(999L);
                });

                assertEquals("Product not found with id: 999", exception.getMessage());
                verify(productRepository, times(1)).findById(999L);
                verify(productRepository, never()).delete(any());
        }

        @Test
        @DisplayName("TC9: Lấy tất cả sản phẩm không phân trang")
        void testGetAllProducts() {
                List<Product> products = Arrays.asList(
                                new Product(1L, "Laptop", 15000000, 10, "Electronics"),
                                new Product(2L, "Mouse", 390000, 40, "Electronics"),
                                new Product(3L, "Headphones", 1290000, 10, "Electronics"));

                when(productRepository.findAll()).thenReturn(products);

                List<ProductDto> result = productService.getAllProducts();

                // Verify kết quả
                assertNotNull(result);
                assertEquals(3, result.size());

                ProductDto firstProduct = result.get(0);
                assertEquals(1L, firstProduct.getId());
                assertEquals("Laptop", firstProduct.getName());
                assertEquals(15000000, firstProduct.getPrice());
                assertEquals(10, firstProduct.getQuantity());
                assertEquals("Electronics", firstProduct.getCategory());

                ProductDto secondProduct = result.get(1);
                assertEquals(2L, secondProduct.getId());
                assertEquals("Mouse", secondProduct.getName());
                assertEquals(390000, secondProduct.getPrice());

                ProductDto thirdProduct = result.get(2);
                assertEquals(3L, thirdProduct.getId());
                assertEquals("Headphones", thirdProduct.getName());

                // Verify repository được gọi đúng 1 lần
                verify(productRepository, times(1)).findAll();
        }
}