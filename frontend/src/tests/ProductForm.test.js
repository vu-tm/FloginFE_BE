import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductForm from "../components/Product/ProductForm";

// tao san pham mac dinh de test
describe("ProductForm Component", () => {
  const mockProduct = {
    id: 1,
    name: "",
    price: "",
    quantity: "",
    category: "",
  };

  test("hien thi tieu de khi an them san pham", () => {
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={() => {}}
        onCancel={() => {}}
        onSubmit={() => {}}
        nextId={2}
      />
    );
    expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();
  });

  test("tét cho nhập tên sản phẩm và gọi onChange", () => {
    const handleChange = jest.fn();
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={handleChange}
        onCancel={() => {}}
        onSubmit={() => {}}
        nextId={2}
      />
    );
    const nameInput = screen.getByPlaceholderText("Nhập tên sản phẩm");
    fireEvent.change(nameInput, {
      target: { value: "Điện thoại Iphone 17 Promax" },
    });
    expect(handleChange).toHaveBeenCalledWith({
      ...mockProduct,
      name: "Điện thoại Iphone 17 Promax",
    });
  });

  test("test nhập giá sản phẩm", () => {
    const handleChange = jest.fn();
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={handleChange}
        onCancel={() => {}}
        onSubmit={() => {}}
        nextId={2}
      />
    );
    const priceInput = screen.getByPlaceholderText("Nhập giá");
    fireEvent.change(priceInput, { target: { value: 36000000 } });
    expect(handleChange).toHaveBeenCalledWith({
      ...mockProduct,
      price: "36000000",
    });
  });

  test("test nhập số lượng", () => {
    const handleChange = jest.fn();
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={handleChange}
        onCancel={() => {}}
        onSubmit={() => {}}
        nextId={2}
      />
    );
    const quantityInput = screen.getByPlaceholderText("Nhập số lượng");
    fireEvent.change(quantityInput, { target: { value: 5 } });
    expect(handleChange).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: "5",
    });
  });

  test("test chon the loai", () => {
    const handleChange = jest.fn();
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={handleChange}
        onCancel={() => {}}
        onSubmit={() => {}}
        nextId={2}
      />
    );
    const categorySelect = screen.getByRole("combobox"); // combobox = select
    fireEvent.change(categorySelect, { target: { value: "food" } });
    expect(handleChange).toHaveBeenCalledWith({
      ...mockProduct,
      category: "food",
    });
  });

  test("test goi onSubmit khi an nut them", () => {
    const handleSubmit = jest.fn();
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={() => {}}
        onCancel={() => {}}
        onSubmit={handleSubmit}
        nextId={2}
      />
    );
    fireEvent.click(screen.getByText("Thêm"));
    expect(handleSubmit).toHaveBeenCalled();
  });

  test("test goi onCancel khi an nut Huy", () => {
    const handleCancel = jest.fn();
    render(
      <ProductForm
        mode="create"
        initialProduct={mockProduct}
        onChange={() => {}}
        onCancel={handleCancel}
        onSubmit={() => {}}
        nextId={2}
      />
    );
    fireEvent.click(screen.getByText("Hủy"));
    expect(handleCancel).toHaveBeenCalled();
  });
});
