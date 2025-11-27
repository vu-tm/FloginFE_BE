import { CirclePlus, Edit, Eye, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductList.css"; // Import CSS
import ProductForm from "./ProductForm";
import ProductDetail from "./ProductDetail";
import * as productService from "../../services/productService";
export default function ProductList() {
  const navigate = useNavigate(); // Dùng để chuyển hướng trang (hook)
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm sau lọc (tạm để trống vì chưa có tìm kiếm)
  const [showCreateModal, setShowCreateModal] = useState(false); // Trạng thái tạo sản phẩm
  const [showEditModal, setShowEditModal] = useState(false); // Trạng thái sửa
  const [showDetailModal, setShowDetailModal] = useState(false); // Trạng thái xem chi tiết
  const [editingProduct, setEditingProduct] = useState(null); // Đối tượng sản phẩm đang sửa
  const [detailProduct, setDetailProduct] = useState(null); // Đối tượng sản phẩm đang xem chi tiết
  const [newProduct, setNewProduct] = useState({
    // Dữ liệu form tạo sản phẩm
    name: "",
    price: "",
    quantity: "",
    category: "model",
  });
  // Demo data, khi test cho nhung cai khong lien quan toi api
  const demoProducts = [
    {
      id: 1,
      name: "Tai nghe Bluetooth Sony WH-CH520",
      price: 1290000,
      quantity: 10,
      category: "electronics",
    },
    {
      id: 2,
      name: "Snack khoai tây Lay’s vị BBQ",
      price: 18000,
      quantity: 120,
      category: "food",
    },
    {
      id: 3,
      name: "Mô hình Gundam RX-78-2 HG 1/144",
      price: 499000,
      quantity: 15,
      category: "model",
    },
    {
      id: 4,
      name: "Chuột Logitech M331 Silent Plus",
      price: 390000,
      quantity: 40,
      category: "electronics",
    },
  ];

  useEffect(() => {
    // Nạp giả lập dữ liệu
    setProducts(demoProducts);
    setFilteredProducts(demoProducts);
  }, []);
  //khi test cho api
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    }
    fetchData();
  }, []);
  const handleCreateProduct = () => {
    // Hàm handle khi tạo sản phẩm
    const product = {
      id: products.length + 1,
      ...newProduct,
      price: Number(newProduct.price),
      quantity: Number(newProduct.quantity),
    };
    setProducts([...products, product]); // Thêm vào danh sách hiện ngay dưới bảng
    setShowCreateModal(false);
    setNewProduct({ name: "", price: "", quantity: "", category: "model" }); // Reset form
  };

  const handleEditProduct = () => {
    // Hàm handle khi sửa sản phẩm
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id
          ? {
            ...editingProduct,
            price: Number(editingProduct.price),
            quantity: Number(editingProduct.quantity),
          }
          : p
      )
    );
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(id); // gọi API
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Xóa sản phẩm thất bại:", error);
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
    const map = {
      electronics: "Điện tử",
      food: "Thức ăn",
      model: "Mô hình",
    };
    return map[category] || category;
  };

  return (
    <>
      <div className="container">
        {/* Header */}
        <h1 className="title">Quản lý sản phẩm</h1>
        <div className="header">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <CirclePlus className="icon-small" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Bảng sản phẩm */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="table">
              {/* Header bảng */}
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

              {/* Body bảng */}
              {/* Body bảng */}
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="table-row-hover">
                      {/* Mã sản phẩm */}
                      <td>
                        <div className="user-name">
                          SP-{product.id.toString().padStart(3, "0")}
                        </div>
                      </td>

                      {/* Tên sản phẩm */}
                      <td>
                        <div className="user-name">{product.name}</div>
                      </td>

                      {/* Giá */}
                      <td>
                        <div className="user-name">
                          {formatPrice(product.price)}
                        </div>
                      </td>

                      {/* Số lượng */}
                      <td>
                        <div className="user-name">{product.quantity}</div>
                      </td>

                      {/* Loại */}
                      <td>
                        <span className={`badge role-${product.category}`}>
                          {getCategoryName(product.category)}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="action-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => openDetail(product)}
                            className="btn-icon"
                            title="Xem chi tiết"
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
                          >
                            <Edit className="icon-small" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-icon text-red"
                            title="Xóa"
                          >
                            <Trash2 className="icon-small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal thêm sản phẩm */}
        {showCreateModal && (
          <ProductForm
            mode="create"
            product={newProduct}
            onChange={setNewProduct}
            onCancel={() => setShowCreateModal(false)}
            onSubmit={handleCreateProduct}
            nextId={products.length + 1}
          />
        )}

        {/* Modal sửa sản phẩm */}
        {showEditModal && editingProduct && (
          <ProductForm
            mode="edit"
            product={editingProduct}
            onChange={setEditingProduct}
            onCancel={() => setShowEditModal(false)}
            onSubmit={handleEditProduct}
          />
        )}

        {/* Modal xem chi tiết – màu sắc & bố cục khác */}
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
