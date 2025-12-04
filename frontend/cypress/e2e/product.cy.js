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
            productPage.getSuccessMessage().should('contain', 'thành công')
            productPage.getProductInList(testProduct.name).should('exist')
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
            const duplicateName = `Sản phẩm test trùng tên ${Date.now()}`
            // Tạo lần 1
            productPage.clickAddNew()
            productPage.fillProductForm({
                name: duplicateName,
                price: '1000000',
                quantity: '5',
                category: 'electronics'
            })
            productPage.submitForm()
            cy.wait(2000)

            // Tạo lần 2 → phải lỗi trùng tên
            productPage.clickAddNew()
            productPage.fillProductForm({
                name: duplicateName,
                price: '2000000',
                quantity: '10',
                category: 'food'
            })
            productPage.submitForm()
            cy.wait(1000)
            productPage.getErrorMessage()
                .should('contain', 'Tên sản phẩm đã tồn tại')
                .and('be.visible')
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

        it('TC7 [Read Detail] - Nên hiển thị chi tiết sản phẩm đầy đủ và chính xác khi click "Xem chi tiết"', () => {
            const detailProduct = {
                name: `Product Detail Test ${Date.now()}`,
                price: '25999000',
                quantity: '25',
                category: 'electronics'
            }

            // Tạo sản phẩm mới
            productPage.clickAddNew()
            productPage.fillProductForm(detailProduct)
            productPage.submitForm()
            cy.wait(2000)
            productPage.getSuccessMessage().should('contain', 'thành công')

            // Click xem chi tiết
            productPage.clickViewDetailOnProduct(detailProduct.name)

            // Đợi modal hiện
            cy.get('.modal-detail', { timeout: 10000 }).should('be.visible')

            // Kiểm tra từng field trong modal chi tiết
            cy.get('.modal-detail').within(() => {
                // Loại
                cy.contains('.detail-row', 'Loại')
                    .find('.badge')
                    .should('contain', 'Điện tử')

                // Tên sản phẩm
                cy.contains('.detail-row', 'Tên sản phẩm')
                    .find('.detail-value.large')
                    .should('contain', detailProduct.name)

                // 4. Giá: đúng định dạng tiền Việt Nam
                cy.contains('.detail-row', 'Giá')
                    .find('.detail-value.large')
                    .should('contain', '25.999.000')

                // 5. Số lượng
                cy.contains('.detail-row', 'Số lượng')
                    .find('.detail-value.large')
                    .should('contain', detailProduct.quantity)
            })

            // Đóng modal
            productPage.closeDetailModal()
            cy.get('.modal-detail').should('not.exist')
        })
    })

    // === UPDATE OPERATIONS ===
    describe('Update Product Operations', () => {
        describe('Update Product Operations', () => {
            it('TC8 [Update Success] - Nên cập nhật sản phẩm thành công', () => {
                const product = {
                    name: `Laptop Update Test ${Date.now()}`,
                    price: '18000000',
                    updatedPrice: '16999000',
                    quantity: '5',
                    category: 'electronics'
                }

                // Tạo sản phẩm mới trước khi update
                productPage.clickAddNew()
                productPage.fillProductForm(product)
                productPage.submitForm()
                cy.wait(2000)

                // Update giá
                productPage.clickEditOnProduct(product.name)
                productPage.fillProductForm({ price: product.updatedPrice })
                productPage.submitForm()
                cy.wait(1500)

                productPage.getSuccessMessage().should('contain', 'thành công')
                productPage.getProductInList(product.name)
                    .within(() => {
                        cy.get('[data-testid="product-price"]').should('contain', '16.999.000')
                    })
            })

            it('TC9 [Update Cancel] - Nên giữ nguyên thông tin khi hủy cập nhật', () => {
                productPage.clickEditOnProduct(testProduct.name)
                productPage.fillProductForm({ name: 'Tên tạm thời không lưu' })
                productPage.cancelForm()

                productPage.getProductInList(testProduct.name).should('exist')
                cy.contains('Tên tạm thời không lưu').should('not.exist')
            })
        })

        // === SEARCH/FILTER OPERATIONS ===
        describe('Search/Filter Operations', () => {
            it('TC10 [Search] - Nên tìm kiếm chính xác theo tên', () => {
                productPage.searchProduct('Laptop')
                productPage.getAllProductItems().each(($row) => {
                    productPage.getProductNameInRow($row)
                        .invoke('text')
                        .should('include', 'Laptop')
                })
                cy.contains('Tìm thấy').should('be.visible')
            })

            it('TC11 [Filter Category] - Nên lọc đúng theo danh mục', () => {
                productPage.filterByCategory('electronics')
                cy.wait(1000)
                cy.get('[data-testid="product-item"] .badge').each(($badge) => {
                    cy.wrap($badge).should('contain', 'Điện tử')
                })
            })

            it('TC12 [Search No Results] - Nên hiển thị thông báo khi không tìm thấy', () => {
                productPage.searchProduct('SảnPhẩmKhôngTồnTại12345')
                productPage.getNoResultsMessage().should('be.visible')
                productPage.getAllProductItems().should('have.length', 0)
            })

            it('TC13 [Combined Search + Filter] - Kết hợp tìm kiếm và lọc danh mục', () => {
                productPage.searchProduct('Laptop')
                productPage.filterByCategory('electronics')

                productPage.getAllProductItems().each(($row) => {
                    productPage.getProductNameInRow($row).invoke('text').should('include', 'Laptop')
                    productPage.getProductCategoryInRow($row).should('contain', 'Điện tử')
                })
            })

            it('TC14 [Clear Search] - Xóa tìm kiếm phải hiện lại toàn bộ', () => {
                productPage.searchProduct('Laptop')
                productPage.clearSearch()
                productPage.getAllProductItems().should('have.length.at.least', 1)
            })

            it('TC15 [Filter All] - Chọn "Tất cả danh mục" phải hiện tất cả', () => {
                productPage.filterByCategory('all')
                cy.wait(1000)
                productPage.getAllProductItems().should('have.length.at.least', 1)
            })
        })

        // === EDGE CASES ===
        describe('Edge Cases', () => {
            it('TC16 [Boundary] - Tên sản phẩm 3 ký tự vẫn được chấp nhận', () => {
                const shortName = `A${Date.now().toString().slice(-2)}`
                productPage.clickAddNew()
                productPage.fillProductForm({
                    name: shortName,
                    price: '999000',
                    quantity: '5',
                    category: 'model'
                })
                productPage.submitForm()
                cy.wait(1500)
                productPage.getSuccessMessage().should('contain', 'thành công')
                productPage.getProductInList(shortName).should('exist')
            })
        })

        // === DELETE OPERATIONS ===
        describe('Delete Product Operations', () => {
            it('TC17 [Delete Cancel] - Hủy xóa thì sản phẩm vẫn còn', () => {
                productPage.clickDeleteOnProduct(testProduct.name)
                productPage.cancelDelete() // từ chối confirm
                cy.wait(500)
                productPage.getProductInList(testProduct.name).should('exist')
            })

            it('TC18 [Delete Success] - Xác nhận xóa thì sản phẩm biến mất', () => {
                // Tạo lại một sản phẩm để xóa
                const productToDelete = {
                    name: `Sản phẩm sẽ bị xóa ${Date.now()}`,
                    price: '5000000',
                    quantity: '3',
                    category: 'food'
                }

                productPage.clickAddNew()
                productPage.fillProductForm(productToDelete)
                productPage.submitForm()
                cy.wait(2000)

                productPage.clickDeleteOnProduct(productToDelete.name)
                productPage.confirmDelete() // chấp nhận confirm
                cy.wait(200)

                productPage.getSuccessMessage().should('contain', 'thành công')
                productPage.getProductInList(productToDelete.name).should('not.exist')
            })
        })
    })
})