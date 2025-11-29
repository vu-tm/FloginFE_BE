import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "../components/Product/ProductForm";

describe("ProductForm - Integration Tests (Create & Edit)", () => {
  // 1. Tạo sản phẩm thành công
  test("Tạo sản phẩm mới thành công", async () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        nextId={5}
      />
    );

    // Nhập đầy đủ dữ liệu hợp lệ
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Hiệp sĩ LBX" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập giá"), {
      target: { value: "20000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập số lượng"), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByText("Thêm"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Hiệp sĩ LBX",
      price: 20000,
      quantity: 10,
      category: "model",
    });
  });

  // 2. Tạo sản phẩm thất bại (thiếu tên → required)
  test("Tạo sản phẩm thất bại khi thiếu tên", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
        nextId={5}
      />
    );

    // Chỉ nhập giá và số lượng, bỏ trống tên
    fireEvent.change(screen.getByPlaceholderText("Nhập giá"), {
      target: { value: "20000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập số lượng"), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByText("Thêm"));

    // onSubmit KHÔNG được gọi vì form invalid
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
    // Input tên vẫn trống
    expect(screen.getByPlaceholderText("Nhập tên sản phẩm").value).toBe("");
  });

  test("Tạo sản phẩm thất bại khi thiếu số lượng", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
        nextId={5}
      />
    );

    // Chỉ nhập giá và số lượng, bỏ trống soluong
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "San pham test 02" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập giá"), {
      target: { value: "20000" },
    });
    fireEvent.click(screen.getByText("Thêm"));
    // onSubmit KHÔNG được gọi vì form invalid
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
    expect(screen.getByPlaceholderText("Nhập số lượng").value).toBe("");
  });

  test("Tạo sản phẩm thất bại khi thiếu giá", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="create"
        initialProduct={{}}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
        nextId={5}
      />
    );

    // Chỉ nhập giá và số lượng, bỏ trống soluong
    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "San pham test 02" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập số lượng"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByText("Thêm"));
    // onSubmit KHÔNG được gọi vì form invalid
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
    expect(screen.getByPlaceholderText("Nhập giá").value).toBe("");
  });

  // 3. Cập nhật sản phẩm thành công
  test("Cập nhật sản phẩm thành công", async () => {
    const mockOnSubmit = jest.fn();

    const existingProduct = {
      id: 3,
      name: "Hiệp sĩ LBX",
      price: 20000,
      quantity: 10,
      category: "model",
    };

    render(
      <ProductForm
        mode="edit"
        initialProduct={existingProduct}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Hiệp sĩ LBX"), {
      target: { value: "Robo Trái cây đỏ" },
    });

    fireEvent.click(screen.getByText("Cập nhật"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: 3,
      name: "Robo Trái cây đỏ",
      price: 20000,
      quantity: 10,
      category: "model",
    });
  });

  // 4. Cập nhật sản phẩm thất bại (xóa tên → không submit)
  test("Cập nhật sản phẩm thất bại khi xóa tên sản phẩm", async () => {
    const mockOnSubmit = jest.fn();

    render(
      <ProductForm
        mode="edit"
        initialProduct={{
          id: 3,
          name: "Hiệp sĩ LBX",
          price: 20000,
          quantity: 10,
          category: "model",
        }}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
      />
    );

    // Xóa tên sản phẩm (backspace hết)
    const nameInput = screen.getByDisplayValue("Hiệp sĩ LBX");
    fireEvent.change(nameInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("Cập nhật"));

    // onSubmit KHÔNG được gọi vì thiếu tên
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    // Form vẫn mở, không đóng
    expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
  });

  // 5. Hủy form
  test("Hủy form khi nhấn nút Hủy", () => {
    const mockOnCancel = jest.fn();
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
  });
});
