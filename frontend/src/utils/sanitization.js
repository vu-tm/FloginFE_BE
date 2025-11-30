export const sanitizeProduct = (product) => {
    const sanitized = { ...product };

    // Tên sản phẩm: trim và xóa khoảng trắng thừa
    if (sanitized.name) {
        sanitized.name = sanitized.name.trim().replace(/\s+/g, ' ');
    }

    // Giá: đảm bảo là số nguyên dương
    if (sanitized.price) {
        sanitized.price = Math.max(0, Math.floor(Number(sanitized.price)));
    }

    // Số lượng: đảm bảo là số nguyên không âm
    if (sanitized.quantity) {
        sanitized.quantity = Math.max(0, Math.floor(Number(sanitized.quantity)));
    }

    // Danh mục: trim và chuyển thành lowercase
    if (sanitized.category) {
        sanitized.category = sanitized.category.trim().toLowerCase();
    }

    return sanitized;
};

// Sanitization cho các trường nhập liệu real-time
export const sanitizeInput = {
    name: (value) => value.trim().replace(/\s+/g, ' '),
    price: (value) => value.replace(/[^\d]/g, ''), // Chỉ cho phép số
    quantity: (value) => value.replace(/[^\d]/g, ''), // Chỉ cho phép số
    category: (value) => value.trim()
};