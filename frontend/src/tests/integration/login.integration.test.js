import Login from "../../components/Login/Login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as authService from "../../services/authService";

describe("Login Component - Render", () => {
    test("Kiem tra input username ton tai, type va value mac dinh", () => {
        render(<Login />);
        const userInput = screen.getByTestId("username-input");
        expect(userInput).toBeInTheDocument(); // Kiểm tra tồn tại
        expect(userInput).toHaveAttribute("type", "text"); // Kiểm tra type
        expect(userInput).toHaveValue(""); // Giá trị mặc định
    });
    test("Kiem tra input password tontai, type va vale mac dinh", () => {
        render(<Login />);
        const passwordInput = screen.getByTestId("password-input");
        expect(passwordInput).toBeInTheDocument(); // Kiểm tra tồn tại
        expect(passwordInput).toHaveAttribute("type", "password"); // Kiểm tra type
        expect(passwordInput).toHaveValue(""); // Giá trị mặc định
    });

    test("Kiem tra render login button", () => {
        render(<Login />);
        const btnLogin = screen.getByTestId("login-button");
        expect(btnLogin).toBeInTheDocument(); // Kiểm tra tồn tại
        expect(btnLogin).toHaveTextContent("Sign in"); // Kiểm tra hiện đúng text
    });

    test("Nguoi dung co the nhap vao input username", () => {
        render(<Login />);
        const usernameInput = screen.getByTestId("username-input");
        fireEvent.change(usernameInput, { target: { value: "Admin" } });
        expect(usernameInput.value).toBe("Admin")
    })
    test("Nguoi dung co the nhap vao input password", () => {
        render(<Login />);
        const passwordInput = screen.getByTestId("password-input");
        fireEvent.change(passwordInput, { target: { value: "123@cF" } });
        expect(passwordInput.value).toBe("123@cF")
    })

    test("Doi trang thai khi an vao xem password", () => {
        render(<Login />)
        const passwordInput = screen.getByTestId("password-input");
        const toggleBtn = screen.getByRole("button", { name: "show-password" });
        expect(passwordInput.type).toBe("password"); // type ban đầu
        fireEvent.click(toggleBtn); // Ấn đổi trạng thái qua xem pass
        expect(passwordInput.type).toBe("text");

        fireEvent.click(toggleBtn); // Ấn đổi trạng thái về mặc định
        expect(passwordInput.type).toBe("password");
    })
})

global.alert = jest.fn(); // mock giả lập alert trong jest
describe("Login Component - Test form submission và API calls", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    test("Gọi API đăng nhập với username và password chính xác", async () => {
        // theo dõi và mock hàm authService.loginUser, mockResolvedValue trả về promise giả lập thành công
        const mockLogin = jest.spyOn(authService, "loginUser").mockResolvedValue({ success: true });
        render(<Login />)
        const usernameInput = screen.getByTestId("username-input");
        const passwordInput = screen.getByTestId("password-input");
        const btnLogin = screen.getByTestId("login-button");
        fireEvent.change(usernameInput, { target: { value: "Admin" } });
        fireEvent.change(passwordInput, { target: { value: "123@Cf" } })
        fireEvent.click(btnLogin)
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("Admin", "123@Cf"); // Kiểm tra có đúng với tham số truyền vào
        })
        expect(global.alert).toHaveBeenCalledWith("Login thanh cong"); // Ktra alert có được thông báo
        expect(localStorage.getItem("isLoggedIn")).toBe("true") // Ktra value bên trong localStorage
    });

    test("Kiểm tra khi API bị lỗi, alert hiển thị", async () => {
        // Giả lập mockRejectedValue thất bại 
        const mockLogin = jest.spyOn(authService, "loginUser").mockRejectedValue(new Error("Login failed"))
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
        expect(global.alert).toHaveBeenCalledWith("Login failed");
    })
})

describe("Login Component - Error handling & success messages", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 3c username
    test("Hiển thị thông báo với trường hợp kiểm tra validationUsername thất bại - Trường hợp username rỗng",
        () => {
            render(<Login />)
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith("Ten dang nhap khong duoc de trong");
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationUsername thất bại - Trường hợp chứa ký tự đặc biệt",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "A#d%min" } })
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith('Username chi chua cac ky tu a-z, A-Z, 0-9 và "_"');
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationUsername thất bại - Trường hợp username quá ngắn",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "aa" } })
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith('Ten dang nhap phai co do dai tu 3-50 ky tu');
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationUsername thất bại - Trường hợp username quá dài",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, {
                target: {
                    value: "aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaaaaaa.aaaaaaaaaa"
                }
            })
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith('Ten dang nhap phai co do dai tu 3-50 ky tu');
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationUsername thất bại - Trường hợp username có space",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, {
                target: {
                    value: "A d m i n"
                }
            })
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith('Username khong ton tai khoang trang');
        });

    // Password
    test("Hiển thị thông báo với trường hợp kiểm tra validationPassword thất bại - Trường hợp password rỗng",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "Admin" } });
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith("Password khong duoc de trong");
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationPassword thất bại - Trường hợp password quá ngắn",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const passwordInput = screen.getByTestId("password-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "Admin" } });
            fireEvent.change(passwordInput, { target: { value: "aa" } });
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith("Password co do dai tu 6-100 ky tu");
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationPassword thất bại - Trường hợp password quá dài",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const passwordInput = screen.getByTestId("password-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "Admin" } });
            fireEvent.change(passwordInput, {
                target: {
                    value: 'aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa'
                        + ' aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa.aaaaaaaaaa'
                }
            });
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith("Password co do dai tu 6-100 ky tu");
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationPassword thất bại - Trường hợp password chứa space",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const passwordInput = screen.getByTestId("password-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "Admin" } });
            fireEvent.change(passwordInput, {
                target: {
                    value: "1 2 3 4 5"
                }
            });
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith("Password khong ton tai khoang trang");
        });
    test("Hiển thị thông báo với trường hợp kiểm tra validationPassword thất bại - Trường hợp password sai định dạng",
        () => {
            render(<Login />)
            const usernameInput = screen.getByTestId("username-input");
            const passwordInput = screen.getByTestId("password-input");
            const btnLogin = screen.getByTestId("login-button");
            fireEvent.change(usernameInput, { target: { value: "Admin" } });
            fireEvent.change(passwordInput, {
                target: {
                    value: "pass123"
                }
            });
            fireEvent.click(btnLogin);
            expect(global.alert).toHaveBeenCalledWith('Password khong dung dinh dang, phai co it nhat 1 chu cai hoa, '
                + '1 chu cai thuong, 1 so, 1 ky tu dac biet');

        });

    // Thông báo thành công
    test("Hiển thị thông báo khi login thành công", async () => {
        jest.spyOn(authService, "loginUser").mockResolvedValue({ success: true });
        render(<Login />)
        const usernameInput = screen.getByTestId("username-input");
        const passwordInput = screen.getByTestId("password-input");
        const btnLogin = screen.getByTestId("login-button");
        fireEvent.change(usernameInput, { target: { value: "Admin" } });
        fireEvent.change(passwordInput, { target: { value: "123@Cf" } })
        fireEvent.click(btnLogin)
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Login thanh cong");
        })
    })
    test("Hiển thị thông báo khi login thất bại bởi API", async () => {
        jest.spyOn(authService, "loginUser").mockRejectedValue(new Error("Login failed"));
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "Admin123" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Pass123@" } });
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith("Login failed");
        });
    })
})
