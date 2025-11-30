const VALID_CATEGORIES = ["electronics", "food", "model"];
import { sanitizeProduct } from './sanitization';

export const validateProduct = (product) => {
  // Sanitize trước khi validate
  const sanitizedProduct = sanitizeProduct(product);
  const errors = {};

  // Tên sản phẩm
  const name = product.name?.trim() || "";

  if (!name) {
    errors.name = "Tên sản phẩm không được để trống";
  } else if (name.length < 3 || name.length > 100) {
    errors.name = "Tên sản phẩm phải từ 3 đến 100 ký tự";
  } else if (!/^[\p{L}0-9\s\-,.()]+$/u.test(name)) {
    errors.name = "Tên sản phẩm chứa ký tự không hợp lệ";
  }

  // Giá sản phẩm
  const price = Number(product.price);
  if (!product.price && product.price !== 0) {
    errors.price = "Giá sản phẩm không được để trống";
  } else if (isNaN(price)) {
    errors.price = "Giá sản phẩm phải là số";
  } else if (price < 1) {
    errors.price = "Giá sản phẩm phải lớn hơn 0";
  } else if (price > 1000000000) {
    errors.price = "Giá sản phẩm không được vượt quá 1,000,000,000";
  }

  // Số lượng sản phẩm
  const quantity = Number(product.quantity);
  if (!product.quantity && product.quantity !== 0) {
    errors.quantity = "Số lượng sản phẩm không được để trống";
  } else if (isNaN(quantity)) {
    errors.quantity = "Số lượng sản phẩm phải là số";
  } else if (quantity < 0) {
    errors.quantity = "Số lượng sản phẩm phải lớn hơn hoặc bằng 0";
  } else if (quantity > 10000) {
    errors.quantity = "Số lượng sản phẩm không được vượt quá 10,000";
  }

  // Danh mục sản phẩm
  if (!product.category) {
    errors.category = "Danh mục sản phẩm không được để trống";
  } else if (!VALID_CATEGORIES.includes(product.category)) {
    errors.category = "Danh mục sản phẩm không hợp lệ";
  }

  // Mô tả sản phẩm (optional)
  if (product.description && product.description.length > 500) {
    errors.description = "Mô tả không được vượt quá 500 ký tự";
  }

  return errors;
};