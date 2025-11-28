import { X } from "lucide-react";
import { useState } from "react";
import "./ProductList.css";

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

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
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

    // KIỂM TRA FORM HỢP LỆ TRƯỚC KHI GỌI onSubmit
    if (!e.target.checkValidity()) {
      e.target.reportValidity(); // hiện thông báo lỗi của browser (tốt cho UX)
      return; // DỪNG LẠI, KHÔNG gọi onSubmit
    }

    const submittedProduct = {
      ...(isCreate ? {} : { id: initialProduct.id }),
      name: formData.name.trim(),
      price: Number(formData.price) || 0,
      quantity: Number(formData.quantity) || 0,
      category: formData.category,
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

        <form onSubmit={handleSubmit}>
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

              <div>
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  value={formData.name}
                  onChange={handleChange("name")}
                  className="input"
                  required
                  data-testid="product-name"
                />
              </div>

              <div>
                <label>Giá *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Nhập giá"
                  value={formData.price}
                  onChange={handleChange("price")}
                  className="input"
                  required
                  data-testid="product-price"
                />
              </div>

              <div>
                <label>Số lượng *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Nhập số lượng"
                  value={formData.quantity}
                  onChange={handleChange("quantity")}
                  className="input"
                  required
                  data-testid="product-quantity"
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label>Loại *</label>
                <select
                  value={formData.category}
                  onChange={handleChange("category")}
                  className="input"
                  required
                >
                  <option value="electronics">Điện tử</option>
                  <option value="food">Thức ăn</option>
                  <option value="model">Mô hình</option>
                </select>
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
