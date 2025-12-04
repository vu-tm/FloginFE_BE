const VALID_CATEGORIES = ["electronics", "food", "model"];
import { sanitizeProduct } from './sanitization';

export const validateProduct = (product) => {
  // Sanitize trước khi validate
  const sanitizedProduct = sanitizeProduct(product);
  const errors = {};

  // Tên sản phẩm
  const name = product.name?.trim() || "";

  if (!name) {
    errors.name = "Ten san pham khong duoc de trong";
  } else if (name.length < 3 || name.length > 100) {
    errors.name = "Ten san pham phai tu 3 den 100 ky tu";
  } else if (!/^[\p{L}0-9\s\-,.()]+$/u.test(name)) {
    errors.name = "Ten san pham chua ky tu khong hop le";
  }

  // Giá sản phẩm
  const price = Number(product.price);
  if (product.price === "" || product.price === null || product.price === undefined) {
    errors.price = "Gia san pham khong duoc de trong";
  } else if (isNaN(price)) {
    errors.price = "Gia san pham phai la so";
  } else if (price < 1) {
    errors.price = "Gia san pham phai lon hon 0";
  } else if (price > 1000000000) {
    errors.price = "Gia san pham khong duoc vuot qua 1,000,000,000";
  }

  // Số lượng sản phẩm
  const quantity = Number(product.quantity);
  if (product.quantity === "" || product.quantity === null || product.quantity === undefined) {
    errors.quantity = "So luong san pham khong duoc de trong";
  } else if (isNaN(quantity)) {
    errors.quantity = "So luong san pham phai la so";
  } else if (quantity < 0) {
    errors.quantity = "So luong phai lon hon hoac bang 0";
  } else if (quantity > 10000) {
    errors.quantity = "So luong san pham khong duoc vuot qua 10,000";
  }

  // Danh mục sản phẩm
  if (!product.category) {
    errors.category = "Danh muc khong hop le";
  } else if (!VALID_CATEGORIES.includes(product.category)) {
    errors.category = "Danh muc khong hop le";
  }

  // Mô tả sản phẩm (optional)
  if (product.description && product.description.length > 500) {
    errors.description = "Mo ta khong duoc vuot qua 500 ky tu";
  }

  return errors;
};