/**
* cy.visit(): Cypress mở 1 url cụ thể
* cy.click: Click phần tử đã chọn
* cy.get(): chọn phần tử dựa trên selector (class, id, tag…)
* cy.type(): Nhập text vào input/textarea
* cy.clear(): Xóa nội dung trong input/textarea
* cy.should(): xác nhận giá trị của input có đúng văn bản đã nhập hay không
* cy.contains(): Tìm kiếm phần tử chứa văn bản cụ thể
* Tìm không thấy thì cypress sẽ tìm liên tục trong 4 giây rồi mới báo lỗi
**/

class LoginPage {
    visit() {
        cy.visit('http://localhost:3000')
    }

    // --- Lấy các phần tử trên trang ---
    getUsernameInput() {
        return cy.get('[data-testid="username-input"]')
    }

    getPasswordInput() {
        return cy.get('[data-testid="password-input"]')
    }

    getLoginButton() {
        return cy.get('[data-testid="login-button"]')
    }

    getShowPasswordButton() {
        return cy.get('[aria-label="show-password"]')
    }

    getUsernameError() {
        return cy.get('[data-testid="username-error"]', { timeout: 5000 })
    }

    getPasswordError() {
        return cy.get('[data-testid="password-error"]', { timeout: 5000 })
    }

    getLoginMessage() {
        return cy.get('[data-testid="login-message"]', { timeout: 10000 })
    }

    // --- Các hành động trên trang Login ---
    fillUsername(username) {
        // Xử lý trường hợp username rỗng
        if (username === '') {
            this.getUsernameInput().clear()
        } else {
            this.getUsernameInput().clear().type(username)
        }
    }

    fillPassword(password) {
        // Xử lý trường hợp password rỗng
        if (password === '') {
            this.getPasswordInput().clear()
        } else {
            this.getPasswordInput().clear().type(password)
        }
    }

    fillLoginForm(username, password) {
        if (username !== undefined) {
            this.fillUsername(username)
        }
        if (password !== undefined) {
            this.fillPassword(password)
        }
    }

    clickLogin() {
        this.getLoginButton().click()
    }

    togglePasswordVisibility() {
        this.getShowPasswordButton().click()
    }

    // --- Helper methods ---
    login(username, password) {
        this.fillLoginForm(username, password)
        this.clickLogin()
    }

    verifyRedirectToDashboard() {
        cy.url().should('include', '/products')
    }

    verifyPasswordType(type) {
        this.getPasswordInput().should('have.attr', 'type', type)
    }

    clearForm() {
        this.getUsernameInput().clear()
        this.getPasswordInput().clear()
    }
}

export default LoginPage