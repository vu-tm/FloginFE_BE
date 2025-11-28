import {
  CirclePlus,
  Edit,
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import * as productService from "../../services/productService";

export default function ProductList() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  // Tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lấy dữ liệu
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        alert("Lỗi khi tải sản phẩm");
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    }
    fetchData();
  }, []);

  // Lọc dữ liệu khi search hoặc chọn danh mục
  useEffect(() => {
    let result = products;

    if (searchTerm.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset trang khi lọc
  }, [searchTerm, selectedCategory, products]);

  // Phân trang
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const showAlert = (message, type = "success") => {
    if (type === "success") {
      setSuccessMessage(message);
      setErrorMessage(""); // Clear error message khi có success
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      // Xử lý cho trường hợp error
      setErrorMessage(message);
      setSuccessMessage(""); // Clear success message khi có error
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        showAlert("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Xóa sản phẩm thất bại:", error);
        showAlert("Xóa sản phẩm thất bại!", "error");
      }
    }
  };

  const openDetail = (product) => {
    setDetailProduct(product);
    setShowDetailModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryName = (category) => {
    const map = { electronics: "Điện tử", food: "Thức ăn", model: "Mô hình" };
    return map[category] || category;
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Quản lý sản phẩm</h1>

        <div className="header">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
            data-testid="add-product-btn"
          >
            <CirclePlus className="icon-small" />
            <span>Thêm sản phẩm</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn-logout"
            title="Đăng xuất"
          >
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>

        {/* THANH TÌM KIẾM + LỌC - ĐÃ SỬA ĐẸP, KHÔNG DÍNH NHAU */}
        <div
          style={{
            margin: "20px 0",
            padding: "16px",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
          {/* Ô tìm kiếm */}
          <div
            style={{
              position: "relative",
              flex: "1 1 320px",
              maxWidth: "500px",
            }}
          >
            <Search
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                width: "20px",
                height: "20px",
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "450px",
                padding: "12px 16px 12px 44px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "15px",
                outline: "none",
                transition: "border 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4dabf7")}
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            />
          </div>

          {/* Bộ lọc danh mục */}
          <div style={{ flex: "0 1 200px" }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "15px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="electronics">Điện tử</option>
              <option value="food">Thức ăn</option>
              <option value="model">Mô hình</option>
            </select>
          </div>

          {/* Thông tin kết quả */}
          <div
            style={{
              color: "#495057",
              fontSize: "14px",
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}
          >
            Tìm thấy <strong>{totalItems}</strong> sản phẩm
          </div>
        </div>

        {successMessage && (
          <div
            className="success-message"
            data-testid="success-message"
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              border: "1px solid #c3e6cb",
            }}
          >
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            className="error-message"
            data-testid="error-message"
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              border: "1px solid #f5c6cb",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Bảng sản phẩm */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Loại</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr
                      key={product.id}
                      className="table-row-hover"
                      data-testid="product-item"
                    >
                      <td>
                        <div className="user-name">
                          SP-{product.id.toString().padStart(3, "0")}
                        </div>
                      </td>
                      <td>
                        <div className="user-name" data-testid="product-name">
                          {product.name}
                        </div>
                      </td>
                      <td>
                        <div className="user-name" data-testid="product-price">
                          {formatPrice(product.price)}
                        </div>
                      </td>
                      <td>
                        <div
                          className="user-name"
                          data-testid="product-quantity"
                        >
                          {product.quantity}
                        </div>
                      </td>
                      <td>
                        <span className={`badge role-${product.category}`}>
                          {getCategoryName(product.category)}
                        </span>
                      </td>
                      <td className="action-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => openDetail(product)}
                            className="btn-icon"
                            title="Xem chi tiết"
                            data-testid="view-detail-btn"
                          >
                            <Eye className="icon-small" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowEditModal(true);
                            }}
                            className="btn-icon text-blue"
                            title="Chỉnh sửa"
                            data-testid="edit-product-btn"
                          >
                            <Edit className="icon-small" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-icon text-red"
                            title="Xóa"
                            data-testid="delete-product-btn"
                          >
                            <Trash2 className="icon-small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4"
                      style={{ color: "#6c757d" }}
                    >
                      {searchTerm || selectedCategory !== "all"
                        ? "Không tìm thấy sản phẩm nào phù hợp"
                        : "Không có sản phẩm nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                background: currentPage === 1 ? "#f8f9fa" : "white",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ChevronLeft size={18} /> Trước
            </button>

            <span style={{ fontSize: "15px", color: "#495057" }}>
              Trang <strong>{currentPage}</strong> / {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                background: currentPage === totalPages ? "#f8f9fa" : "white",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Sau <ChevronRight size={18} />
            </button>

            <span
              style={{ marginLeft: "20px", color: "#6c757d", fontSize: "14px" }}
            >
              Hiển thị {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, totalItems)} trong{" "}
              {totalItems}
            </span>
          </div>
        )}

        {/* Các Modal giữ nguyên */}
        {showCreateModal && (
          <ProductForm
            mode="create"
            initialProduct={{}}
            nextId={products.length + 1}
            onCancel={() => setShowCreateModal(false)}
            onSubmit={async (product) => {
              try {
                const newProductFromApi = await productService.createProduct(
                  product
                );
                setProducts([...products, newProductFromApi]);
                setShowCreateModal(false);
                showAlert("Thêm sản phẩm thành công");
              } catch (err) {
                showAlert("Thêm sản phẩm thất bại", "error");
              }
            }}
          />
        )}

        {showEditModal && editingProduct && (
          <ProductForm
            mode="edit"
            initialProduct={editingProduct}
            onCancel={() => setShowEditModal(false)}
            onSubmit={async (updatedProduct) => {
              try {
                const saved = await productService.updateProduct(
                  updatedProduct.id,
                  updatedProduct
                );
                setProducts(
                  products.map((p) => (p.id === saved.id ? saved : p))
                );
                setShowEditModal(false);
                showAlert("Cập nhật sản phẩm thành công");
              } catch (err) {
                showAlert("Cập nhật sản phẩm thất bại", "error");
              }
            }}
          />
        )}

        {showDetailModal && detailProduct && (
          <ProductDetail
            product={detailProduct}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </>
  );
}
