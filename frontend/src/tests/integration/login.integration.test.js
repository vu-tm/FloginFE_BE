import Login from "../../components/Login/Login";
import { fireEvent, render, screen } from "@testing-library/react";

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
// describe("User can type into username and password fields", () => {

// })
// describe("State thay đổi theo input", () => {

// })