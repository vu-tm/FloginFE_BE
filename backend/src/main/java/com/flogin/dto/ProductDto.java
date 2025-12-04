package com.flogin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ProductDto {
    private Long id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    @Pattern(regexp = "^[\\p{L}0-9\\s\\-_,.()]+$", message = "Tên sản phẩm chứa ký tự không hợp lệ")
    private String name;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @Min(value = 1, message = "Giá sản phẩm phải lớn hơn 0")
    @Max(value = 1000000000, message = "Giá sản phẩm không được vượt quá 1,000,000,000")
    private int price;

    @NotNull(message = "Số lượng sản phẩm không được để trống")
    @Min(value = 0, message = "Số lượng sản phẩm phải lớn hơn hoặc bằng 0")
    @Max(value = 10000, message = "Số lượng sản phẩm không được vượt quá 10,000")
    private int quantity;

    @NotBlank(message = "Danh mục sản phẩm không được để trống")
    @Pattern(regexp = "^(electronics|food|model)$", message = "Danh mục sản phẩm không hợp lệ")
    private String category;

    // Constructors
    public ProductDto() {
    }

    public ProductDto(String name, int price, int quantity, String category) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    // Constructor với ID
    public ProductDto(Long id, String name, int price, int quantity, String category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}