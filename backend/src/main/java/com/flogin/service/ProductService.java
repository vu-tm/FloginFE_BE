package com.flogin.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // CREATE - Tạo sản phẩm mới
    public ProductDto createProduct(ProductDto productDto) {
        validateProductNameNotDuplicate(productDto.getName());

        // 1. Tạo entity từ DTO
        Product product = new Product();
        product.setName(productDto.getName());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());
        product.setCategory(productDto.getCategory());

        // 2. Lưu vào database
        Product savedProduct = productRepository.save(product);

        // 3. Chuyển entity đã lưu thành DTO và trả về
        return mapToDto(savedProduct);
    }

    // READ - Lấy sản phẩm theo ID
    public ProductDto getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToDto(product);
    }

    // UPDATE - Cập nhật sản phẩm
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        // 1. Tìm product cũ
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (!existingProduct.getName().equals(productDto.getName())) {
            validateProductNameNotDuplicateForUpdate(productDto.getName(), id);
        }

        // 2. Cập nhật thông tin mới
        existingProduct.setName(productDto.getName());
        existingProduct.setPrice(productDto.getPrice());
        existingProduct.setQuantity(productDto.getQuantity());
        existingProduct.setCategory(productDto.getCategory());

        // 3. Lưu lại
        Product updatedProduct = productRepository.save(existingProduct);
        return mapToDto(updatedProduct);
    }

    // DELETE - Xóa sản phẩm
    public void deleteProduct(Long id) {
        // 1. Kiểm tra tồn tại
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // 2. Xóa
        productRepository.delete(existingProduct);
    }

    // GET ALL - Lấy tất cả sản phẩm
    public List<ProductDto> getAllProducts() {
        // 1. Lấy tất cả sản phẩm từ database
        List<Product> products = productRepository.findAll();

        // 2. Chuyển từ entity sang DTO
        return products.stream()
                .map(product -> mapToDto(product))
                .collect(Collectors.toList());
    }

    // GET ALL - Lấy tất cả sản phẩm với phân trang
    public Page<ProductDto> getAllProductsWithPagination(int page, int size) {
        // 1. Tạo thông tin phân trang. page: số trang bắt đầu từ 0
        Pageable pageable = PageRequest.of(page, size);

        // 2. Lấy dữ liệu phân trang từ database
        Page<Product> productPage = productRepository.findAll(pageable);

        // 3. Chuyển từ Page<Product> thành Page<ProductDto>
        return productPage.map(product -> mapToDto(product));
    }

    // Helper method chuyển từ Entity sang DTO
    private ProductDto mapToDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setPrice(product.getPrice());
        productDto.setQuantity(product.getQuantity());
        productDto.setCategory(product.getCategory());
        return productDto;
    }

    private void validateProductNameNotDuplicate(String name) {
        if (productRepository.existsByName(name)) {
            throw new IllegalArgumentException("Product with name '" + name + "' already exists");
        }
    }

    private void validateProductNameNotDuplicateForUpdate(String name, Long excludeId) {
        if (productRepository.existsByNameAndIdNot(name, excludeId)) {
            throw new IllegalArgumentException("Product with name '" + name + "' already exists");
        }
    }
}
