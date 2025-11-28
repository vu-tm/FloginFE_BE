package com.flogin.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*; // import get, post, put, delete
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*; // import status, content, jsonPath
import static org.hamcrest.Matchers.hasSize;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;

// Mẫu DTO -> Mock Service -> Gọi Http endpoint
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(ProductController.class) // Chỉ load tầng Controller
@DisplayName("Product API Integration Test")
public class ProductControllerIntegrationTest {
        @Autowired
        private MockMvc mockMvc; // Giả lập Http request

        @MockBean
        private ProductService productService;

        // ======================jsonPath======================== //
        // $: toàn bộ object
        // $.id: id của object ..., tương tự với các thuộc tính khác
        // $[0]: object đầu tiên trong mảng
        // .hasSize(): kiểm tra kích thước
        // .value(): kiểm tra gtri
        // .exists(): kiểm tra tồn tại
        // .isArray() / .isString() / .isNumber(): Kiểm tra kiểu dữ liệu
        // .isEmpty(): kiểm tra rỗng
        // ====================================================== //

        @Test // a
        @DisplayName("GET /api/products - Lấy danh sách sản phẩm")
        // Viết test cho web layer phải throws Exception
        // mockMvc.perform(...) trả về ResultActions
        void testGetAllProducts() throws Exception {
                // GIVEN
                List<ProductDto> products = Arrays.asList(
                                new ProductDto("Laptop", 15000000, 10, "Electronics"),
                                new ProductDto("Mouse", 390000, 40, "Electronics"));

                when(productService.getAllProducts()).thenReturn(products);

                mockMvc.perform(get("/api/products"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(2)))
                                .andExpect(jsonPath("$[0].name").value("Laptop"))
                                .andExpect(jsonPath("$[1].name").value("Mouse"))
                                .andExpect(jsonPath("$[0].price").value(15000000))
                                .andExpect(jsonPath("$[1].price").value(390000));
        }

        @Test // b
        @DisplayName("GET /api/products/{id} - Lấy sản phẩm theo ID")
        void testGetProductById() throws Exception {
                // GIVEN
                ProductDto productDto = new ProductDto(1L, "Laptop", 15000000, 10, "Electronics");

                when(productService.getProduct(1L)).thenReturn(productDto);

                mockMvc.perform(get("/api/products/{id}", 1L))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.name").value("Laptop"))
                                .andExpect(jsonPath("$.price").value(15000000))
                                .andExpect(jsonPath("$.quantity").value(10))
                                .andExpect(jsonPath("$.category").value("Electronics"));
        }

        @Test // c
        @DisplayName("POST /api/products - Tạo sản phẩm mới")
        void testCreateProduct() throws Exception {
                // GIVEN
                ProductDto product = new ProductDto(1L, "Laptop", 15000000, 10, "Electronics");

                when(productService.createProduct(any(ProductDto.class)))
                                .thenReturn(product);

                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON) // Khai báo gửi dữ liệu dạng JSON
                                // .content(""" ... """) Nội dung JSON gửi lên server
                                .content("""
                                                    {
                                                        "name": "Laptop",
                                                        "price": 15000000,
                                                        "quantity": 10,
                                                        "category": "Electronics"
                                                    }
                                                """))

                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id").value(1))
                                .andExpect(jsonPath("$.name").value("Laptop"))
                                .andExpect(jsonPath("$.price").value(15000000))
                                .andExpect(jsonPath("$.quantity").value(10))
                                .andExpect(jsonPath("$.category").value("Electronics"));
        }

        @Test // d
        @DisplayName("PUT /api/products/{id} - Cập nhật sản phẩm thành công")
        void testUpdateProduct() throws Exception {
                // GIVEN
                ProductDto updatedProduct = new ProductDto(1L, "Laptop Pro", 20000000, 12, "Electronics");

                when(productService.updateProduct(eq(1L), any(ProductDto.class)))
                                .thenReturn(updatedProduct);

                // WHEN & THEN
                mockMvc.perform(put("/api/products/{id}", 1L)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                                {
                                                    "name": "Laptop Pro",
                                                    "price": 20000000,
                                                    "quantity": 12,
                                                    "category": "Electronics"
                                                }
                                                """))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1))
                                .andExpect(jsonPath("$.name").value("Laptop Pro"))
                                .andExpect(jsonPath("$.price").value(20000000))
                                .andExpect(jsonPath("$.quantity").value(12))
                                .andExpect(jsonPath("$.category").value("Electronics"));
        }

        @Test // e
        @DisplayName("DELETE /api/products/{id} - Xóa sản phẩm thành công")
        void testDeleteProduct() throws Exception {
                // GIVEN
                Long productId = 1L;

                doNothing().when(productService).deleteProduct(productId);

                // WHEN & THEN
                mockMvc.perform(delete("/api/products/{id}", productId))
                                .andExpect(status().isNoContent());
        }
}
