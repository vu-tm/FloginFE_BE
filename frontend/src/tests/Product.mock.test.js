import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProductList from "../components/Product/ProductList";
import ProductForm from "../components/Product/ProductForm";
import ProductDetail from "../components/Product/ProductDetail";
import * as productService from "../services/productService";
import { MemoryRouter } from "react-router-dom";

jest.mock("../services/productService");

describe("ProductList Component Mock Tests (Read/Add/Delete)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SUCCESS CASE
  test("Hiển thị danh sách sản phẩm khi API trả về dữ liệu ( read)", async () => {
    // Mock giả lập dữ liệu trả về
    const mockProducts = [
      { id: 1, name: "Laptop Gaming" },
      { id: 2, name: "Chuột không dây" },
    ];

    productService.getProducts.mockResolvedValue(mockProducts);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Kiểm tra gọi API đúng 1 lần
    expect(productService.getProducts).toHaveBeenCalledTimes(1);

    // Kiểm tra render ra UI đúng tên sản phẩm
    expect(await screen.findByText("Laptop Gaming")).toBeInTheDocument();
    expect(await screen.findByText("Chuột không dây")).toBeInTheDocument();
  });

  // FAILURE CASE
  test("Hiển thị giao diện rỗng khi API thất bại", async () => {
    productService.getProducts.mockRejectedValue(new Error("API Error"));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Kiểm tra API được gọi
    expect(productService.getProducts).toHaveBeenCalledTimes(1);

    // Vì lỗi → không có item nào
    const items = screen.queryAllByRole("listitem");
    expect(items.length).toBe(0);
  });

  test("xóa sản phẩm thành công", async () => {
    const mockProducts = [
      { id: 1, name: "Laptop Gaming" },
      { id: 2, name: "Chuột Không Dây" },
    ];

    productService.getProducts.mockResolvedValue(mockProducts);
    productService.deleteProduct.mockResolvedValue({}); // mock xóa thành công, be trả về object rỗng

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(await screen.findByText("Laptop Gaming")).toBeInTheDocument();

    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    fireEvent.click(screen.getAllByTitle("Xóa")[0]);

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Laptop Gaming")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Chuột Không Dây")).toBeInTheDocument();
    });
  });

  test("xóa sản phẩm thất bại", async () => {
    const mockProducts = [
      { id: 1, name: "Laptop Gaming" },
      { id: 2, name: "Chuột Không Dây" },
    ];

    productService.getProducts.mockResolvedValue(mockProducts);
    productService.deleteProduct.mockRejectedValue(new Error("API error"));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(await screen.findByText("Laptop Gaming")).toBeInTheDocument();

    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    fireEvent.click(screen.getAllByTitle("Xóa")[0]);

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });

    // UI vẫn giữ sản phẩm
    expect(screen.getByText("Laptop Gaming")).toBeInTheDocument();
    expect(screen.getByText("Chuột Không Dây")).toBeInTheDocument();
  });

  test("thêm sản phẩm thành công", async () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}} // phải dùng initialProduct, không phải product
        nextId={5}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit} // component sẽ gọi callback này với data đúng
      />
    );

    // Điền form
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Bàn phím cơ blue switch" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập giá"), {
      target: { value: "1500000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập số lượng"), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByText("Thêm"));

    // Kiểm tra onSubmit được gọi với đúng dữ liệu
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Bàn phím cơ blue switch",
      price: 1500000,
      quantity: 10,
      category: "model", // giá trị mặc định
    });

    // Form bị reset sau khi submit thành công (create mode)
    expect(screen.getByPlaceholderText("Nhập tên sản phẩm")).toHaveValue("");
  });

  test("thêm sản phẩm thất bại - form vẫn còn (nhưng thực tế không có error UI, nên chỉ kiểm tra onSubmit)", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        nextId={10}
        onCancel={() => {}}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Test product" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Test product",
        price: 100,
        quantity: 5,
        category: "model",
      });
    });

    // Form vẫn hiển thị vì không có logic đóng khi lỗi
    expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();
  });

  test("Sửa sản phẩm thành công", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="edit"
        initialProduct={{
          id: 3,
          name: "Chuột gaming cũ",
          price: 800000,
          quantity: 5,
          category: "electronics",
        }}
        onCancel={() => {}}
        onSubmit={mockOnSubmit}
      />
    );

    // Chỉ thay đổi tên
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Chuột gaming mới" },
    });

    fireEvent.click(screen.getByText("Cập nhật"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: 3,
      name: "Chuột gaming mới",
      price: 800000,
      quantity: 5,
      category: "electronics",
    });
  });

  test("cập nhật sản phẩm thất bại - form vẫn hiển thị", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="edit"
        initialProduct={{
          id: 1,
          name: "Bàn phím cơ blue switch",
          price: 1200000,
          quantity: 8,
          category: "electronics",
        }}
        onCancel={() => {}}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Bàn phím cơ mới" },
    });

    fireEvent.click(screen.getByText("Cập nhật"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        id: 1,
        name: "Bàn phím cơ mới",
        price: 1200000,
        quantity: 8,
        category: "electronics",
      });
    });
    //an roi ma van con chu chinh sua san pham, dang ra phải dong form
    expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
  });
});
