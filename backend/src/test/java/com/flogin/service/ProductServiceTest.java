package com.flogin.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
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

@DisplayName("Product Service Unit Tests")
public class ProductServiceTest {

        @Mock
        private ProductRepository productRepository;

        @InjectMocks
        private ProductService productService;

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);
        }

        // ==================== CREATE TESTS ====================

        @Test
        @DisplayName("TC1: Tạo sản phẩm mới thành công")
        void testCreateProduct_Success() {
                ProductDto productDto = new ProductDto("Laptop", 15000000, 10, "Electronics");
                Product savedProduct = new Product(1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

                ProductDto result = productService.createProduct(productDto);

                assertNotNull(result);
                assertEquals(1L, result.getId());
                assertEquals("Laptop", result.getName());
                assertEquals(15000000, result.getPrice());
                assertEquals(10, result.getQuantity());
                assertEquals("Electronics", result.getCategory());

                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC2: Tạo sản phẩm thất bại - Tên sản phẩm đã tồn tại")
        void testCreateProduct_DuplicateName() {
                ProductDto productDto = new ProductDto("Laptop", 15000000, 10, "Electronics");

                when(productRepository.save(any(Product.class)))
                                .thenThrow(new RuntimeException("Product name already exists"));

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.createProduct(productDto);
                });

                assertEquals("Product name already exists", exception.getMessage());
                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC3: Tạo sản phẩm thất bại - Dữ liệu không hợp lệ")
        void testCreateProduct_InvalidData() {
                ProductDto productDto = new ProductDto(null, -1000, -5, null);

                when(productRepository.save(any(Product.class)))
                                .thenThrow(new RuntimeException("Invalid product data"));

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.createProduct(productDto);
                });

                assertEquals("Invalid product data", exception.getMessage());
                verify(productRepository, times(1)).save(any(Product.class));
        }

        // ==================== READ TESTS ====================

        @Test
        @DisplayName("TC4: Lấy sản phẩm theo ID thành công")
        void testGetProduct_Success() {
                Product product = new Product(1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.findById(1L)).thenReturn(Optional.of(product));

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
        @DisplayName("TC5: Lấy sản phẩm thất bại - Không tìm thấy sản phẩm")
        void testGetProduct_NotFound() {
                when(productRepository.findById(999L)).thenReturn(Optional.empty());

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.getProduct(999L);
                });

                assertEquals("Product not found with id: 999", exception.getMessage());
                verify(productRepository, times(1)).findById(999L);
        }

        @Test
        @DisplayName("TC6: Lấy sản phẩm thất bại - ID là null")
        void testGetProduct_NullId() {
                when(productRepository.findById(null))
                                .thenThrow(new IllegalArgumentException("ID cannot be null"));

                IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
                        productService.getProduct(null);
                });

                assertEquals("ID cannot be null", exception.getMessage());
                verify(productRepository, times(1)).findById(null);
        }

        // ==================== UPDATE TESTS ====================

        @Test
        @DisplayName("TC7: Cập nhật sản phẩm thành công")
        void testUpdateProduct_Success() {
                ProductDto productDto = new ProductDto("Laptop Pro", 20000000, 12, "Electronics");
                Product existingProduct = new Product(1L, "Laptop", 15000000, 10, "Electronics");
                Product updatedProduct = new Product(1L, "Laptop Pro", 20000000, 12, "Electronics");

                when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
                when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

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
        @DisplayName("TC8: Cập nhật sản phẩm thất bại - Không tìm thấy sản phẩm")
        void testUpdateProduct_NotFound() {
                ProductDto productDto = new ProductDto("Laptop Pro", 20000000, 12, "Electronics");

                when(productRepository.findById(999L)).thenReturn(Optional.empty());

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.updateProduct(999L, productDto);
                });

                assertEquals("Product not found with id: 999", exception.getMessage());
                verify(productRepository, times(1)).findById(999L);
                verify(productRepository, never()).save(any());
        }

        @Test
        @DisplayName("TC9: Cập nhật sản phẩm thất bại - Tên mới đã tồn tại")
        void testUpdateProduct_DuplicateName() {
                ProductDto productDto = new ProductDto("Mouse", 500000, 20, "Electronics");
                Product existingProduct = new Product(1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
                when(productRepository.save(any(Product.class)))
                                .thenThrow(new RuntimeException("Product name already exists"));

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.updateProduct(1L, productDto);
                });

                assertEquals("Product name already exists", exception.getMessage());
                verify(productRepository, times(1)).findById(1L);
                verify(productRepository, times(1)).save(any(Product.class));
        }

        // ==================== DELETE TESTS ====================

        @Test
        @DisplayName("TC10: Xóa sản phẩm thành công")
        void testDeleteProduct_Success() {
                Product product = new Product(1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.findById(1L)).thenReturn(Optional.of(product));

                productService.deleteProduct(1L);

                verify(productRepository, times(1)).findById(1L);
                verify(productRepository, times(1)).delete(product);
        }

        @Test
        @DisplayName("TC11: Xóa sản phẩm thất bại - Không tìm thấy sản phẩm")
        void testDeleteProduct_NotFound() {
                when(productRepository.findById(999L)).thenReturn(Optional.empty());

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.deleteProduct(999L);
                });

                assertEquals("Product not found with id: 999", exception.getMessage());
                verify(productRepository, times(1)).findById(999L);
                verify(productRepository, never()).delete(any());
        }

        // ==================== GET ALL WITH PAGINATION TESTS ====================

        @Test
        @DisplayName("TC12: Lấy tất cả sản phẩm với phân trang thành công")
        void testGetAllProductsWithPagination_Success() {
                List<Product> products = Arrays.asList(
                                new Product(1L, "Laptop", 15000000, 10, "Electronics"),
                                new Product(2L, "Mouse", 390000, 40, "Electronics"));

                Pageable pageable = PageRequest.of(0, 2);
                Page<Product> productPage = new PageImpl<>(products, pageable, 3);

                when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);

                Page<ProductDto> result = productService.getAllProductsWithPagination(0, 2);

                assertNotNull(result);
                assertEquals(2, result.getContent().size());
                assertEquals(3, result.getTotalElements());
                assertEquals(2, result.getTotalPages());
                assertEquals(0, result.getNumber());

                ProductDto firstProduct = result.getContent().get(0);
                assertEquals("Laptop", firstProduct.getName());
                assertEquals(15000000, firstProduct.getPrice());

                verify(productRepository, times(1)).findAll(any(Pageable.class));
        }

        @Test
        @DisplayName("TC13: Lấy tất cả sản phẩm với phân trang - Trang rỗng")
        void testGetAllProductsWithPagination_EmptyPage() {
                Pageable pageable = PageRequest.of(5, 10);
                Page<Product> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

                when(productRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

                Page<ProductDto> result = productService.getAllProductsWithPagination(5, 10);

                assertNotNull(result);
                assertEquals(0, result.getContent().size());
                assertEquals(0, result.getTotalElements());
                assertTrue(result.isEmpty());

                verify(productRepository, times(1)).findAll(any(Pageable.class));
        }

        // ==================== GET ALL WITHOUT PAGINATION TESTS ====================

        @Test
        @DisplayName("TC14: Lấy tất cả sản phẩm không phân trang thành công")
        void testGetAllProducts_Success() {
                List<Product> products = Arrays.asList(
                                new Product(1L, "Laptop", 15000000, 10, "Electronics"),
                                new Product(2L, "Mouse", 390000, 40, "Electronics"),
                                new Product(3L, "Headphones", 1290000, 10, "Electronics"));

                when(productRepository.findAll()).thenReturn(products);

                List<ProductDto> result = productService.getAllProducts();

                assertNotNull(result);
                assertEquals(3, result.size());

                ProductDto firstProduct = result.get(0);
                assertEquals(1L, firstProduct.getId());
                assertEquals("Laptop", firstProduct.getName());

                ProductDto secondProduct = result.get(1);
                assertEquals(2L, secondProduct.getId());
                assertEquals("Mouse", secondProduct.getName());

                ProductDto thirdProduct = result.get(2);
                assertEquals(3L, thirdProduct.getId());
                assertEquals("Headphones", thirdProduct.getName());

                verify(productRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("TC15: Lấy tất cả sản phẩm không phân trang - Danh sách rỗng")
        void testGetAllProducts_EmptyList() {
                when(productRepository.findAll()).thenReturn(Collections.emptyList());

                List<ProductDto> result = productService.getAllProducts();

                assertNotNull(result);
                assertEquals(0, result.size());
                assertTrue(result.isEmpty());

                verify(productRepository, times(1)).findAll();
        }

        // ==================== ADDITIONAL UPDATE TESTS ====================

        @Test
        @DisplayName("TC16: Cập nhật sản phẩm thành công - Không thay đổi tên")
        void testUpdateProduct_SameNameSuccess() {
                ProductDto productDto = new ProductDto("Laptop", 20000000, 15, "Electronics");
                Product existingProduct = new Product(1L, "Laptop", 15000000, 10, "Electronics");
                Product updatedProduct = new Product(1L, "Laptop", 20000000, 15, "Electronics");

                when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
                when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

                ProductDto result = productService.updateProduct(1L, productDto);

                assertNotNull(result);
                assertEquals("Laptop", result.getName());
                assertEquals(20000000, result.getPrice());
                assertEquals(15, result.getQuantity());

                verify(productRepository, times(1)).findById(1L);
                verify(productRepository, times(1)).save(any(Product.class));
        }

        @Test
        @DisplayName("TC17: Cập nhật sản phẩm thất bại - Dữ liệu không hợp lệ")
        void testUpdateProduct_InvalidData() {
                ProductDto productDto = new ProductDto(null, -5000, -10, null);
                Product existingProduct = new Product(1L, "Laptop", 15000000, 10, "Electronics");

                when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
                when(productRepository.save(any(Product.class)))
                                .thenThrow(new RuntimeException("Invalid product data"));

                RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                        productService.updateProduct(1L, productDto);
                });

                assertEquals("Invalid product data", exception.getMessage());
                verify(productRepository, times(1)).findById(1L);
                verify(productRepository, times(1)).save(any(Product.class));
        }
}