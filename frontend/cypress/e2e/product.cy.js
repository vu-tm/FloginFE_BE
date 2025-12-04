import ProductPage from '../PageObjects/ProductPage.js'

describe('Product CRUD Operations - Professional', () => {
    const productPage = new ProductPage()

    const testProduct = {
        name: `Laptop Dell ${Date.now()}`,
        price: '15000000',
        quantity: '10',
        updatedPrice: '14000000',
        category: 'electronics'
    }

    beforeEach(() => {
        cy.login('testuser', 'Test@123')
        cy.wait(1000)
        productPage.visit()
    })

    // === CREATE OPERATIONS ===
    describe('Create Product Operations', () => {
        it('TC1 [Create Success] - Nên tạo sản phẩm mới thành công khi nhập đầy đủ thông tin hợp lệ', () => {
            productPage.clickAddNew()
            productPage.fillProductForm(testProduct)
            productPage.submitForm()
            cy.wait(2000)

            productPage.getSuccessMessage()
                .should('contain', 'thành công')
            productPage.getProductInList(testProduct.name)
                .should('exist')
        })

        it('TC2 [Create Validation] - Nên hiển thị lỗi khi không nhập tên sản phẩm', () => {
            productPage.clickAddNew()

            productPage.fillProductForm({
                price: testProduct.price,
                quantity: testProduct.quantity,
                category: testProduct.category
            })
            productPage.submitForm()

            productPage.getModal().should('exist')
            productPage.cancelForm()
        })

        it('TC3 [Create Validation] - Nên hiển thị lỗi khi nhập giá sản phẩm bằng 0', () => {
            productPage.clickAddNew()

            productPage.fillProductForm({
                name: testProduct.name,
                price: '0',
                quantity: testProduct.quantity,
                category: testProduct.category
            })
            productPage.submitForm()

            productPage.shouldShowFieldError('price', 'Gia san pham phai lon hon 0')
            productPage.cancelForm()
        })

        it('TC4 [Create Duplicate Name] - Nên hiển thị lỗi khi tạo sản phẩm với tên trùng lặp', () => {
            const duplicateName = `Sản phẩm test trùng tên`;

            productPage.clickAddNew()
            productPage.fillProductForm({
                name: duplicateName,
                price: '1000000',
                quantity: '5',
                category: 'electronics'
            })
            productPage.submitForm()
            cy.wait(2000)

            // Thử tạo sản phẩm thứ 2 với cùng tên
            productPage.clickAddNew()
            productPage.fillProductForm({
                name: duplicateName,
                price: '2000000',
                quantity: '10',
                category: 'food'
            })
            productPage.submitForm()
            cy.wait(1000)

            // Kiểm tra thông báo lỗi
            productPage.getErrorMessage()
                .should('contain', 'Tên sản phẩm đã tồn tại')
                .and('be.visible')

            // Đảm bảo modal vẫn mở
            productPage.getModal().should('exist')
            productPage.cancelForm()
        })

        it('TC5 [Create Validation] - Nên hiển thị lỗi khi nhập số lượng sản phẩm âm', () => {
            productPage.clickAddNew()

            productPage.fillProductForm({
                name: testProduct.name,
                price: testProduct.price,
                quantity: '-5',
                category: testProduct.category
            })
            productPage.submitForm()

            productPage.shouldShowFieldError('quantity', 'So luong phai lon hon hoac bang 0')
            productPage.cancelForm()
        })
    })

    // === READ OPERATIONS ===  
    describe('Read Product Operations', () => {
        it('TC6 [Read List] - Nên hiển thị danh sách sản phẩm với đầy đủ thông tin', () => {
            cy.get('table').should('exist')
            cy.contains('th', 'Mã sản phẩm').should('exist')
            cy.contains('th', 'Tên sản phẩm').should('exist')
            cy.contains('th', 'Giá').should('exist')
            cy.contains('th', 'Số lượng').should('exist')
            cy.contains('th', 'Loại').should('exist')
            cy.get('[data-testid="product-item"]').should('have.length.at.least', 1)
        })

        it('TC7 [Read Detail] - Nên hiển thị chi tiết sản phẩm khi click xem chi tiết', () => {
            productPage.clickViewDetailOnProduct(testProduct.name)
            cy.get('.modal-detail').should('be.visible')
            productPage.closeDetailModal()
        })
    })

    // === UPDATE OPERATIONS ===
    describe('Update Product Operations', () => {
        it('TC8 [Update Success] - Nên cập nhật sản phẩm thành công khi sửa thông tin hợp lệ', () => {
            productPage.clickEditOnProduct(testProduct.name)
            productPage.fillProductForm({ price: testProduct.updatedPrice })
            productPage.submitForm()
            cy.wait(1000)

            productPage.getSuccessMessage()
                .should('contain', 'thành công')

            productPage.getProductInList(testProduct.name)
                .within(() => {
                    cy.get('[data-testid="product-price"]')
                        .should('contain', '14.000.000')
                })
        })

        it('TC9 [Update Cancel] - Nên giữ nguyên thông tin sản phẩm khi hủy cập nhật', () => {
            productPage.clickEditOnProduct(testProduct.name)
            productPage.fillProductForm({ name: 'Temporary Name' })
            productPage.cancelForm()

            productPage.getProductInList(testProduct.name).should('exist')
            cy.contains('Temporary Name').should('not.exist')
        })

        it('TC10 [Update Validation] - Nên hiển thị lỗi khi cập nhật với tên sản phẩm trống', () => {
            productPage.clickEditOnProduct(testProduct.name)

            // Xóa tên sản phẩm
            productPage.getModal().within(() => {
                cy.get('[data-testid="product-name"]')
                    .clear() // Đảm bảo xóa hết
            })

            // Submit form
            productPage.submitForm()

            // Thêm wait và debug
            cy.wait(500) // Chờ validation chạy

            productPage.getModal().should('exist')

            productPage.getFieldError('name').then(($error) => {
                if ($error.length === 0) {
                    console.log('No error element found')
                    // Thử kiểm tra giá trị input
                    cy.get('[data-testid="product-name"]').should('have.value', '')
                }
            })

            productPage.shouldShowFieldError('name', 'Ten san pham khong duoc de trong')
            productPage.cancelForm()
        })
    })

    // === DELETE OPERATIONS ===
    describe('Delete Product Operations', () => {
        it('TC11 [Delete Cancel] - Nên giữ nguyên sản phẩm khi hủy xóa', () => {
            productPage.clickDeleteOnProduct(testProduct.name)
            productPage.cancelDelete()

            productPage.getProductInList(testProduct.name).should('exist')
        })

        it('TC12 [Delete Success] - Nên xóa sản phẩm thành công khi xác nhận xóa', () => {
            productPage.clickDeleteOnProduct(testProduct.name)
            productPage.confirmDelete()
            cy.wait(1000)

            productPage.getSuccessMessage()
                .should('contain', 'thành công')
            productPage.getProductInList(testProduct.name)
                .should('not.exist')
        })
    })

    // === SEARCH/FILTER OPERATIONS ===
    describe('Search/Filter Operations', () => {
        it('TC13 [Search Functionality] - Nên tìm kiếm sản phẩm theo tên chính xác', () => {
            const searchTerm = "Laptop";
            productPage.searchProduct(searchTerm)

            productPage.getAllProductItems().each(($item) => {
                productPage.getProductNameInRow($item)
                    .invoke('text')
                    .should('include', searchTerm)
            })

            productPage.getSearchResultsCount().should('contain', 'Tìm thấy')
        })

        it('TC14 [Filter by Category] - Nên lọc sản phẩm theo danh mục chính xác', () => {
            productPage.filterByCategory('electronics')
            cy.wait(1000)

            cy.get('[data-testid="product-item"] .badge').each(($badge) => {
                cy.wrap($badge).should('contain', 'Điện tử')
            })
        })

        it('TC15 [Search No Results] - Nên hiển thị thông báo khi không tìm thấy kết quả tìm kiếm', () => {
            productPage.searchProduct('NonexistentProductName12345')

            productPage.getNoResultsMessage().should('be.visible')
            productPage.getAllProductItems().should('not.exist')
        })

        it('TC16 [Combined Search and Filter] - Nên kết hợp tìm kiếm và lọc danh mục chính xác', () => {
            const searchTerm = "Laptop";
            productPage.searchProduct(searchTerm)
            productPage.filterByCategory('electronics')

            productPage.getAllProductItems().each(($item) => {
                productPage.getProductNameInRow($item)
                    .invoke('text')
                    .should('include', searchTerm)

                productPage.getProductCategoryInRow($item)
                    .should('contain', 'Điện tử')
            })
        })

        it('TC17 [Clear Search] - Nên hiển thị lại tất cả sản phẩm khi xóa tìm kiếm', () => {
            productPage.searchProduct('Laptop')
            productPage.clearSearch()

            productPage.getAllProductItems().should('have.length.at.least', 1)
            cy.contains('Tất cả danh mục').should('be.visible')
        })

        it('TC18 [Filter All Categories] - Nên hiển thị tất cả sản phẩm khi chọn "Tất cả danh mục"', () => {
            productPage.filterByCategory('all')
            cy.wait(1000)

            productPage.getAllProductItems().should('have.length.at.least', 1)
        })
    })

    // === EDGE CASES ===
    describe('Edge Cases', () => {
        it('TC19 [Boundary Value] - Nên tạo sản phẩm thành công khi nhập tên đúng 3 ký tự', () => {
            productPage.clickAddNew()

            productPage.fillProductForm({
                name: 'abc',
                price: '100000',
                quantity: '10',
                category: 'electronics'
            })
            productPage.submitForm()
            cy.wait(1000)

            productPage.getSuccessMessage().should('contain', 'thành công')
            productPage.getProductInList('abc').should('exist')
        })

        it('TC20 [Error Recovery] - Nên tạo sản phẩm thành công sau khi sửa lỗi validation', () => {
            productPage.clickAddNew()

            // Nhập sai trước
            productPage.fillProductForm({
                name: 'ab', // Tên quá ngắn
                price: '0', // Giá = 0
                quantity: testProduct.quantity,
                category: testProduct.category
            })
            productPage.submitForm()

            // Sửa lại đúng
            productPage.fillProductForm(testProduct)
            productPage.submitForm()
            cy.wait(1000)

            productPage.getSuccessMessage().should('contain', 'thành công')
            productPage.getProductInList(testProduct.name).should('exist')
        })
    })
})