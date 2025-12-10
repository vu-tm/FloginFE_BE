import LoginPage from '../PageObjects/LoginPage.js'

describe('Login E2E Tests - Professional', () => {
    const loginPage = new LoginPage()

    const validCredentials = { // User hợp lệ
        username: 'testuser',
        password: 'Test@123'
    }

    const invalidCredentials = {
        emptyUsername: '',
        emptyPassword: '',
        shortUsername: 'ab',
        shortPassword: '123',
        longUsername: 'a'.repeat(51),
        longPassword: 'a'.repeat(101),
        specialCharUsername: 'Admin@123',
        spaceUsername: 'Admin 123',
        spacePassword: '1 2 3 4 5',
        weakPassword: 'pass123'
    }

    beforeEach(() => {
        loginPage.visit()
    })

    describe('Complete Login Flow', () => {
        it('TC1 [Login UI] - Nên hiển thị form login đầy đủ', () => {
            // Kiểm tra các elements chính
            loginPage.getUsernameInput().should('be.visible')
            loginPage.getPasswordInput().should('be.visible')
            loginPage.getLoginButton().should('be.visible')
            loginPage.getShowPasswordButton().should('be.visible')

            // Kiểm tra placeholder
            loginPage.getUsernameInput()
                .should('have.attr', 'placeholder', 'Username')
            loginPage.getPasswordInput()
                .should('have.attr', 'placeholder', 'Password')

            // Kiểm tra type của password input
            loginPage.verifyPasswordType('password')

            // Kiểm tra button text
            loginPage.getLoginButton().should('contain', 'Sign in')
        })

        it('TC2 [Login Success] - Nên login thành công với credentials hợp lệ', () => {
            loginPage.login(validCredentials.username, validCredentials.password)
            cy.wait(1000)

            // Kiểm tra thông báo thành công
            cy.on('window:alert', (text) => {
                expect(text).to.contains('Login thanh cong')
            })

            // Kiểm tra chuyển hướng
            loginPage.verifyRedirectToDashboard()

            // Kiểm tra localStorage
            cy.window().then((win) => {
                expect(win.localStorage.getItem('isLoggedIn')).to.eq('true')
                expect(win.localStorage.getItem('authToken')).to.exist
            })
        })

        it('TC3 [Login Error] - Nên hiển thị lỗi với credentials không hợp lệ', () => {
            loginPage.login('wronguser', 'wrongpass')
            cy.wait(500)

            cy.on('window:alert', (text) => {
                expect(text).to.not.contains('Login thanh cong')
            })

            // Không chuyển trang
            cy.url().should('not.include', '/products')
        })
    })

    // === TEST VALIDATION MESSAGES (0.5 điểm) ===
    describe('Validation Messages', () => {
        it('TC4 [Username Empty] - Nên hiển thị lỗi khi username trống', () => {
            loginPage.fillLoginForm('', validCredentials.password)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Ten dang nhap khong duoc de trong')
            })
        })

        it('TC5 [Username Too Short] - Nên hiển thị lỗi khi username quá ngắn', () => {
            loginPage.fillLoginForm(invalidCredentials.shortUsername, validCredentials.password)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Ten dang nhap phai co do dai tu 3-50 ky tu')
            })
        })

        it('TC6 [Username Too Long] - Nên hiển thị lỗi khi username quá dài', () => {
            loginPage.fillLoginForm(invalidCredentials.longUsername, validCredentials.password)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Ten dang nhap phai co do dai tu 3-50 ky tu')
            })
        })

        it('TC7 [Username Special Chars] - Nên hiển thị lỗi khi username có ký tự đặc biệt', () => {
            loginPage.fillLoginForm(invalidCredentials.specialCharUsername, validCredentials.password)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Username chi chua cac ky tu a-z, A-Z, 0-9 và "_"')
            })
        })

        it('TC8 [Username With Space] - Nên hiển thị lỗi khi username có khoảng trắng', () => {
            loginPage.fillLoginForm(invalidCredentials.spaceUsername, validCredentials.password)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Username khong ton tai khoang trang')
            })
        })

        it('TC9 [Password Empty] - Nên hiển thị lỗi khi password trống', () => {
            loginPage.fillLoginForm(validCredentials.username, '')
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Password khong duoc de trong')
            })
        })

        it('TC10 [Password Too Short] - Nên hiển thị lỗi khi password quá ngắn', () => {
            loginPage.fillLoginForm(validCredentials.username, invalidCredentials.shortPassword)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Password co do dai tu 6-100 ky tu')
            })
        })

        it('TC11 [Password Too Long] - Nên hiển thị lỗi khi password quá dài', () => {
            loginPage.fillLoginForm(validCredentials.username, invalidCredentials.longPassword)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Password co do dai tu 6-100 ky tu')
            })
        })

        it('TC12 [Password With Space] - Nên hiển thị lỗi khi password có khoảng trắng', () => {
            loginPage.fillLoginForm(validCredentials.username, invalidCredentials.spacePassword)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Password khong ton tai khoang trang')
            })
        })

        it('TC13 [Password Weak Format] - Nên hiển thị lỗi khi password không đúng định dạng', () => {
            loginPage.fillLoginForm(validCredentials.username, invalidCredentials.weakPassword)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Password khong dung dinh dang, phai co it nhat 1 chu cai hoa, ' +
                    '1 chu cai thuong, 1 so, 1 ky tu dac biet')
            })
        })
    })

    // === TEST SUCCESS/ERROR FLOWS (0.5 điểm) ===
    describe('Success/Error Flows', () => {
        it('TC14 [Multiple Login Attempts] - Nên xử lý nhiều lần đăng nhập', () => {
            // Lần 1: Thất bại
            loginPage.login('wronguser', 'wrongpass')
            cy.wait(500)
            cy.url().should('not.include', '/products')

            // Lần 2: Thành công
            loginPage.clearForm()
            loginPage.login(validCredentials.username, validCredentials.password)
            cy.wait(1000)
            loginPage.verifyRedirectToDashboard()
        })

        it('TC15 [LocalStorage Persistence] - Nên lưu localStorage sau khi login', () => {
            loginPage.login(validCredentials.username, validCredentials.password)
            cy.wait(1000)

            // Kiểm tra localStorage được set
            cy.window().then((win) => {
                const isLoggedIn = win.localStorage.getItem('isLoggedIn')
                const authToken = win.localStorage.getItem('authToken')

                expect(isLoggedIn).to.eq('true')
                expect(authToken).to.not.be.null
                expect(authToken).to.have.length.greaterThan(0)
            })
        })

        it('TC16 [Error Recovery] - Nên cho phép sửa lỗi và thử lại', () => {
            // Nhập sai
            loginPage.fillLoginForm(invalidCredentials.shortUsername, validCredentials.password)
            loginPage.clickLogin()
            cy.wait(500)

            // Sửa lại đúng
            loginPage.clearForm()
            loginPage.fillLoginForm(validCredentials.username, validCredentials.password)
            loginPage.clickLogin()
            cy.wait(1000)

            loginPage.verifyRedirectToDashboard()
        })
    })

    // === TEST UI ELEMENTS INTERACTIONS (0.5 điểm) ===
    describe('UI Elements Interactions', () => {
        it('TC17 [Toggle Password Visibility] - Nên hiển thị/ẩn mật khẩu', () => {
            loginPage.fillPassword('Test@123')

            // Mặc định là password type
            loginPage.verifyPasswordType('password')

            // Click để hiển thị
            loginPage.togglePasswordVisibility()
            loginPage.verifyPasswordType('text')

            // Click để ẩn lại
            loginPage.togglePasswordVisibility()
            loginPage.verifyPasswordType('password')
        })

        it('TC18 [Input Focus] - Nên focus vào input khi click', () => {
            loginPage.getUsernameInput().click()
            loginPage.getUsernameInput().should('have.focus')

            loginPage.getPasswordInput().click()
            loginPage.getPasswordInput().should('have.focus')
        })

        it('TC19 [Clear Input] - Nên xóa được nội dung input', () => {
            loginPage.fillLoginForm('testuser', 'Test@123')

            loginPage.getUsernameInput().should('have.value', 'testuser')
            loginPage.getPasswordInput().should('have.value', 'Test@123')

            loginPage.clearForm()

            loginPage.getUsernameInput().should('have.value', '')
            loginPage.getPasswordInput().should('have.value', '')
        })

        it('TC20 [Button Click] - Nên submit form khi click button', () => {
            loginPage.fillLoginForm(validCredentials.username, validCredentials.password)

            loginPage.getLoginButton().should('be.enabled')
            loginPage.getLoginButton().click()

            cy.wait(1000)
            loginPage.verifyRedirectToDashboard()
        })

        it('TC21 [Form Submit on Enter] - Nên submit khi nhấn Enter', () => {
            loginPage.fillLoginForm(validCredentials.username, validCredentials.password)

            // Nhấn Enter ở password field
            loginPage.getPasswordInput().type('{enter}')

            cy.wait(1000)
            loginPage.verifyRedirectToDashboard()
        })

        it('TC22 [Input Auto-trim] - Nên xử lý khoảng trắng thừa', () => {
            // Username với space đầu cuối
            loginPage.getUsernameInput().type('  testuser  ')

            // Kiểm tra validation vẫn bắt lỗi space
            loginPage.fillPassword(validCredentials.password)
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Username khong ton tai khoang trang')
            })
        })
    })

    // === EDGE CASES ===
    describe('Edge Cases', () => {
        it('TC23 [Empty Form Submit] - Nên báo lỗi khi submit form trống', () => {
            loginPage.clickLogin()

            cy.on('window:alert', (text) => {
                expect(text).to.eq('Ten dang nhap khong duoc de trong')
            })
        })

        it('TC24 [Special Characters in Password] - Nên chấp nhận ký tự đặc biệt trong password', () => {
            const specialPassword = 'Test@123!#$'
            loginPage.fillLoginForm(validCredentials.username, specialPassword)

            // Password field nên chứa giá trị
            loginPage.getPasswordInput().should('have.value', specialPassword)
        })

        it('TC25 [Case Sensitivity] - Username nên phân biệt hoa thường', () => {
            loginPage.fillLoginForm('TESTUSER', validCredentials.password)
            loginPage.clickLogin()
            cy.wait(500)

            // Nếu backend phân biệt hoa thường thì sẽ lỗi
            cy.url().should('not.include', '/products')
        })
    })
})