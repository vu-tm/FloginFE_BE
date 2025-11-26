import Login from "../../components/Login/Login";
import * as authService from "../../services/authService";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

window.alert = jest.fn();
delete window.location;
window.location = { href: "" };
describe("Login - Mock Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("TC1: Gọi API đăng nhập với username, password, token và số lần chính xác", async () => {
    const mockLogin = jest.spyOn(authService, "loginUser").mockResolvedValue({
      success: true,
      token: 'gia-lap-token'
    })
    render(<Login />);
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const btnLogin = screen.getByTestId("login-button");
    fireEvent.change(usernameInput, { target: { value: "Admin" } });
    fireEvent.change(passwordInput, { target: { value: "123@Cf" } })
    fireEvent.click(btnLogin);
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("Admin", "123@Cf");
    })
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Login thanh cong");
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(localStorage.getItem("authToken")).toBe("gia-lap-token");
    expect(window.location.href).toBe("/products");
  })

  test("TC2: Đăng nhập thất bại với username và password chính xác nhưng không tồn tại", async () => {
    const mockLoginFalse = jest.spyOn(authService, "loginUser")
      .mockResolvedValue({ success: false, message: "Username/Password không tồn tại" });
    render(<Login />);
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const btnLogin = screen.getByTestId("login-button");
    fireEvent.change(usernameInput, { target: { value: "Admin" } });
    fireEvent.change(passwordInput, { target: { value: "123@Cf" } })
    fireEvent.click(btnLogin);
    await waitFor(() => {
      expect(mockLoginFalse).toHaveBeenCalledWith("Admin", "123@Cf");
    })
    expect(mockLoginFalse).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Username/Password không tồn tại");
  })

  test("TC3: Kiểm tra khi API bị lỗi, alert hiển thị", async () => {
    const mockLogin = jest.spyOn(authService, "loginUser").mockRejectedValue(new Error("Network Error"))
    render(<Login />)
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const btnLogin = screen.getByTestId("login-button");
    fireEvent.change(usernameInput, { target: { value: "Admin" } });
    fireEvent.change(passwordInput, { target: { value: "123@Cf" } })
    fireEvent.click(btnLogin)
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("Admin", "123@Cf");
    })
    expect(window.alert).toHaveBeenCalledWith("Network Error");
  })
})