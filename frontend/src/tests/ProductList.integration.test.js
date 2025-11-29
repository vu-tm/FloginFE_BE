import { render, screen, waitFor } from "@testing-library/react";
import ProductList from "../components/Product/ProductList";
import { getProducts } from "../services/productService";
import { MemoryRouter } from "react-router-dom";

// Mock service
jest.mock("../services/productService", () => ({
  getProducts: jest.fn(),
}));

// clear mock
afterEach(() => {
  jest.clearAllMocks();
});

describe("ProductList - Integration Test với API mock", () => {
  test("hiển thị loading khi đang tải dữ liệu", async () => {
    getProducts.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/đang tải danh sách sản phẩm/i)
    ).toBeInTheDocument();
  });

  test("hiển thị danh sách sản phẩm khi API thành công", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Tai nghe Sony",
        price: 1290000,
        quantity: 10,
        category: "electronics",
      },
      {
        id: 2,
        name: "Snack Lay’s",
        price: 18000,
        quantity: 50,
        category: "food",
      },
    ];
    getProducts.mockResolvedValue(mockProducts);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(await screen.findByText("Tai nghe Sony")).toBeInTheDocument();
    expect(screen.getByText("Snack Lay’s")).toBeInTheDocument();
  });

  test("hiển thị thông báo lỗi khi API thất bại", async () => {
    getProducts.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(await screen.findByText(/không tải được/i)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("hiển thị 'Không có sản phẩm nào' khi danh sách rỗng", async () => {
    getProducts.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );
    expect(
      await screen.findByText("Không có sản phẩm nào")
    ).toBeInTheDocument();
  });
});
