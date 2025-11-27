import { X } from "lucide-react";
import "./ProductList.css"; // Giữ nguyên style cũ

export default function ProductForm({
  mode, // 'create' hoặc 'edit'
  product, // dữ liệu hiện tại (newProduct hoặc editingProduct)
  onChange, // hàm setState
  onCancel, // click nút Hủy
  onSubmit, // click nút Thêm / Cập nhật
  nextId, // ID kế tiếp (chỉ dùng khi create)
}) {
  const isCreate = mode === "create";
  const title = isCreate ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm";
  const submitLabel = isCreate ? "Thêm" : "Cập nhật";
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div>
              <label>Mã sản phẩm</label>
              <input
                type="text"
                value={`SP-${(isCreate ? nextId : product.id)
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
                value={product.name}
                onChange={(e) => onChange({ ...product, name: e.target.value })}
                className="input"
                data-testid="product-name"
              />
            </div>

            <div>
              <label>Giá *</label>
              <input
                type="number"
                placeholder="Nhập giá"
                value={product.price}
                onChange={(e) =>
                  onChange({ ...product, price: e.target.value })
                }
                className="input"
                data-testid="product-price"
              />
            </div>

            <div>
              <label>Số lượng *</label>
              <input
                type="number"
                placeholder="Nhập số lượng"
                value={product.quantity}
                onChange={(e) =>
                  onChange({ ...product, quantity: e.target.value })
                }
                className="input"
                data-testid="product-quantity"
              />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label>Loại *</label>
              <select
                value={product.category}
                onChange={(e) =>
                  onChange({ ...product, category: e.target.value })
                }
                className="input"
                data-testid="product-category"
              >
                <option value="electronics">Điện tử</option>
                <option value="food">Thức ăn</option>
                <option value="model">Mô hình</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="btn-secondary">
            Hủy
          </button>
          <button onClick={handleSubmit} className="btn-primary" data-testid="submit-btn">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
