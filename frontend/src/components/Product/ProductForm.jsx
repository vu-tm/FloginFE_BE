import { X } from "lucide-react";
import { useState } from "react";
import "./ProductList.css";
import { validateProduct } from "../../utils/productValidation";

export default function ProductForm({
  mode, // 'create' | 'edit'
  initialProduct, // dữ liệu ban đầu (khi edit) hoặc {} khi create
  onCancel,
  onSubmit, // nhận vào object product đã đúng định dạng
  nextId, // chỉ dùng khi create để hiển thị mã SP-xxx
}) {
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    price: initialProduct?.price || "",
    quantity: initialProduct?.quantity || "",
    category: initialProduct?.category || "model",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const newErrors = validateProduct({
        ...formData,
        [field]: value
      });
      setErrors(newErrors);
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate field khi blur
    const newErrors = validateProduct(formData);
    setErrors(newErrors);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const submittedProduct = {
  //     // id sẽ do backend sinh hoặc bạn truyền nextId khi create (nếu cần hiển thị tạm)
  //     ...(isCreate ? {} : { id: initialProduct.id }),
  //     name: formData.name.trim(),
  //     price: Number(formData.price) || 0,
  //     quantity: Number(formData.quantity) || 0,
  //     category: formData.category,
  //   };

  //   // Gọi callback từ cha (ProductList) để xử lý tiếp (gọi API hoặc cập nhật state)
  //   onSubmit(submittedProduct);

  //   // Nếu là create → reset form
  //   if (isCreate) {
  //     setFormData({
  //       name: "",
  //       price: "",
  //       quantity: "",
  //       category: "model",
  //     });
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      price: true,
      quantity: true,
      category: true,
    });

    // Validate form
    const validationErrors = validateProduct(formData);
    setErrors(validationErrors);

    // Nếu có lỗi, dừng lại
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const submittedProduct = {
      ...(isCreate ? {} : { id: initialProduct.id }),
      name: formData.name.trim().replace(/\s+/g, ' '), // Sanitize tên
      price: Number(formData.price) || 0,
      quantity: Number(formData.quantity) || 0,
      category: formData.category.trim(), // Sanitize category
    };

    onSubmit(submittedProduct);

    if (isCreate) {
      setFormData({
        name: "",
        price: "",
        quantity: "",
        category: "model",
      });
    }
  };

  // Helper function để xác định class cho input
  const getInputClassName = (field) => {
    const baseClass = "input";
    if (!touched[field]) return baseClass;
    return errors[field] ? `${baseClass} input-error` : baseClass;
  };

  const title = isCreate ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm";
  const submitLabel = isCreate ? "Thêm" : "Cập nhật";

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              <div>
                <label>Mã sản phẩm</label>
                <input
                  type="text"
                  value={`SP-${(isCreate ? nextId : initialProduct?.id || "")
                    .toString()
                    .padStart(3, "0")}`}
                  disabled
                  className="input"
                />
              </div>

              <div className="input-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  value={formData.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  className={getInputClassName("name")}
                  data-testid="product-name"
                />
                {touched.name && errors.name && (
                  <span className="error-text" data-testid="name-error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Giá *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Nhập giá"
                  value={formData.price}
                  onChange={handleChange("price")}
                  onBlur={handleBlur("price")}
                  className={getInputClassName("price")}
                  data-testid="product-price"
                />
                {touched.price && errors.price && (
                  <span className="error-text" data-testid="price-error">
                    {errors.price}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Số lượng *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Nhập số lượng"
                  value={formData.quantity}
                  onChange={handleChange("quantity")}
                  onBlur={handleBlur("quantity")}
                  className={getInputClassName("quantity")}
                  data-testid="product-quantity"
                />
                {touched.quantity && errors.quantity && (
                  <span className="error-text" data-testid="quantity-error">
                    {errors.quantity}
                  </span>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Loại *</label>
                <select
                  value={formData.category}
                  onChange={handleChange("category")}
                  onBlur={handleBlur("category")}
                  className={getInputClassName("category")}
                >
                  <option value="">Chọn loại sản phẩm</option>
                  <option value="electronics">Điện tử</option>
                  <option value="food">Thức ăn</option>
                  <option value="model">Mô hình</option>
                </select>
                {touched.category && errors.category && (
                  <span className="error-text" data-testid="category-error">
                    {errors.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary"
              data-testid="submit-btn"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}