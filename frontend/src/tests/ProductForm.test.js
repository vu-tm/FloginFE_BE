// src/tests/ProductForm.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductForm from "../components/Product/ProductForm";

describe("ProductForm Component", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  // Reset mock trước mỗi test
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test("hiển thị tiêu đề 'Thêm sản phẩm mới' khi mode=create", () => {
    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        nextId={5}
      />
    );
    expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();
  });

  test("hiển thị tiêu đề 'Chỉnh sửa sản phẩm' khi mode=edit", () => {
    render(
      <ProductForm
        mode="edit"
        initialProduct={{ id: 1, name: "iPhone", price: 30000000 }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
  });

  test("hiển thị mã sản phẩm đúng định dạng SP-005 khi create", () => {
    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={() => {}}
        onCancel={() => {}}
        nextId={5}
      />
    );
    expect(screen.getByDisplayValue("SP-005")).toBeInTheDocument();
  });

  test("gọi onSubmit với dữ liệu đúng khi nhấn nút Thêm", () => {
    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        nextId={10}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Tai nghe Sony" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập giá"), {
      target: { value: "1290000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập số lượng"), {
      target: { value: "50" },
    });

    fireEvent.click(screen.getByTestId("submit-btn")); // dùng data-testid là chắc nhất

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Tai nghe Sony",
      price: 1290000,
      quantity: 50,
      category: "model", // giá trị mặc định
    });
  });

  test("gọi onSubmit với dữ liệu đã sửa khi edit", () => {
    render(
      <ProductForm
        mode="edit"
        initialProduct={{
          id: 3,
          name: "Bánh Oreo",
          price: 25000,
          quantity: 100,
          category: "food",
        }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Chỉ sửa tên
    fireEvent.change(screen.getByDisplayValue("Bánh Oreo"), {
      target: { value: "Bánh Oreo mới" },
    });

    fireEvent.click(screen.getByText("Cập nhật"));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: 3,
      name: "Bánh Oreo mới",
      price: 25000,
      quantity: 100,
      category: "food",
    });
  });

  test("gọi onCancel khi nhấn nút Hủy hoặc click ngoài modal", () => {
    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={() => {}}
        onCancel={mockOnCancel}
        nextId={1}
      />
    );

    fireEvent.click(screen.getByText("Hủy"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);

    // Test click ngoài modal
    mockOnCancel.mockClear();
    fireEvent.click(
      screen.getByText("Thêm sản phẩm mới").closest(".modal-overlay")
    );
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("reset form sau khi thêm sản phẩm thành công (create)", async () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        nextId={1}
      />
    );

    // Nhập dữ liệu
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Test product" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập giá"), {
      target: { value: "999999" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập số lượng"), {
      target: { value: "99" },
    });

    // Click Thêm → onSubmit được gọi và form reset
    fireEvent.click(screen.getByText("Thêm"));

    // Đợi React re-render với form đã reset
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    // Bây giờ mới kiểm tra giá trị đã reset về rỗng
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nhập tên sản phẩm").value).toBe("");
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nhập giá").value).toBe("");
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nhập số lượng").value).toBe("");
    });
  });
});
