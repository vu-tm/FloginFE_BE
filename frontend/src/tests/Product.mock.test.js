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
    const mockProduct = {
      id: 1,
      name: "Bàn phím cơ blue switch",
    };

    productService.createProduct.mockResolvedValue(mockProduct);

    // simulate state của form
    let productState = { id: 1, name: "" };
    const setProductState = (newValue) => {
      productState = newValue;
    };

    const handleSubmit = () => productService.createProduct(productState);

    render(
      <ProductForm
        mode="create"
        nextId={1}
        product={productState}
        onChange={setProductState}
        onCancel={() => {}}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Bàn phím cơ blue switch" },
    });

    fireEvent.click(screen.getByText("Thêm"));

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });

    expect(productService.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "Bàn phím cơ blue switch",
      })
    );
  });

  test("thêm sản phẩm thất bại", async () => {
    productService.createProduct.mockRejectedValue(new Error("Thêm thất bại"));

    //giả lập state của form
    let productState = { id: 1, name: "" };
    const setProductState = (newValue) => {
      productState = newValue;
    };

    const handleSubmit = () =>
      productService.createProduct(productState).catch(() => {});

    render(
      <ProductForm
        mode="create"
        nextId={1}
        product={productState}
        onChange={setProductState}
        onCancel={() => {}}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: "Bàn phím cơ blue switch" },
    });
    fireEvent.click(screen.getByText("Thêm"));
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });

    expect(productService.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "Bàn phím cơ blue switch",
      })
    );

    // that bại nên from vẫn còn trên màn hình
    expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();
  });

  test("Sửa sản phẩm thành công", async () => {
    //giả lập json trả về là sản phẩm với cùng 1 id nhưng tên mới
    const mockProduct = {
      id: 1,
      name: "bàn phím cơ màu đen",
    };

    productService.updateProduct.mockResolvedValue(mockProduct);
    let productState = { id: 1, name: "" };
    const setProductState = (newValue) => {
      productState = newValue;
    };

    const handleSubmit = () =>
      productService.updateProduct(productState.id, productState);

    render(
      <ProductForm
        mode="edit"
        nextId={1}
        product={productState}
        onChange={setProductState}
        onCancel={() => {}}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: mockProduct.name },
    });

    fireEvent.click(screen.getByText("Cập nhật"));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    });

    expect(productService.updateProduct).toHaveBeenCalledWith(
      1, // id
      expect.objectContaining({
        id: 1,
        name: "bàn phím cơ màu đen",
      })
    );
  });

  test("cập nhật sản phẩm thất bại", async () => {
    const mockProduct = {
      id: 1,
      name: "Bàn phím cơ blue switch",
    };

    productService.updateProduct.mockRejectedValue(
      new Error("Cập nhật thất bại")
    );

    //giả lập state của form
    let productState = { id: 1, name: "" };
    const setProductState = (newValue) => {
      productState = newValue;
    };

    const handleSubmit = () =>
      productService
        .updateProduct(productState.id, productState)
        .catch(() => {});

    render(
      <ProductForm
        mode="edit"
        nextId={1}
        product={productState}
        onChange={setProductState}
        onCancel={() => {}}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập tên sản phẩm"), {
      target: { value: mockProduct.name },
    });
    fireEvent.click(screen.getByText("Cập nhật"));
    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    });

    expect(productService.updateProduct).toHaveBeenCalledWith(
      mockProduct.id,
      expect.objectContaining({
        id: 1,
        name: "Bàn phím cơ blue switch",
      })
    );

    // that bại nên from vẫn còn trên màn hình
    expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
  });
});
