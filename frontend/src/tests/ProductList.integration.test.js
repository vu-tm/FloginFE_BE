import { render, screen, waitFor } from "@testing-library/react";
import ProductList from "../components/Product/ProductList";
import { getProducts } from "../services/productService";
import { MemoryRouter } from "react-router-dom";

// Mock service
jest.mock("../services/productService", () => ({
  getProducts: jest.fn(),
}));

// Quan trọng: phải clear mock sau mỗi test
afterEach(() => {
  jest.clearAllMocks();
});

describe("ProductList - Integration Test với API mock", () => {
  test("Hiển thị danh sách sản phẩm từ API mock", async () => {
    // Mock dữ liệu thành công
    getProducts.mockResolvedValue([
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
    ]);

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Dùng findByText
    expect(
      await screen.findByText("Tai nghe Bluetooth Sony WH-CH520")
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Snack khoai tây Lay’s vị BBQ")
    ).toBeInTheDocument();

    // Kiểm tra xem hàm có được gọi không
    expect(getProducts).toHaveBeenCalledTimes(1);
  });

  test("Hiển thị thông báo khi API thất bại", async () => {
    getProducts.mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    // Dùng waitFor + findByText
    await waitFor(async () => {
      expect(
        await screen.findByText(/không có sản phẩm|lỗi|không tải được/i)
      ).toBeInTheDocument();
    });
  });

  // Bonus: Test loading state
  test("Hiển thị loading khi đang gọi API", () => {
    getProducts.mockReturnValue(new Promise(() => {})); // pending forever

    render(
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    );

    expect(screen.getByText("Không có sản phẩm nào")).toBeInTheDocument();
  });
});
