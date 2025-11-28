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
        it('TC1 [Create Success] - Nên tạo sản phẩm mới thành công', () => {
            productPage.clickAddNew()
            productPage.fillProductForm(testProduct)
            productPage.submitForm()
            cy.wait(1000)

            productPage.getSuccessMessage()
                .should('contain', 'thành công')
            productPage.getProductInList(testProduct.name)
                .should('exist')
        })

        it('TC2 [Create Validation] - Nên hiển thị lỗi khi tên sản phẩm trống', () => {
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
    })

    // === READ OPERATIONS ===  
    describe('Read Product Operations', () => {
        it('TC3 [Read List] - Nên hiển thị danh sách sản phẩm', () => {
            cy.get('table').should('exist')
            cy.contains('th', 'Mã sản phẩm').should('exist')
            cy.contains('th', 'Tên sản phẩm').should('exist')
            cy.get('[data-testid="product-item"]').should('have.length.at.least', 1)
        })

        it('TC4 [Read Detail] - Nên hiển thị chi tiết sản phẩm', () => {
            productPage.clickViewDetailOnProduct(testProduct.name)
            cy.get('.modal-detail').should('be.visible')
            productPage.closeDetailModal()
        })
    })

    // === UPDATE OPERATIONS ===
    describe('Update Product Operations', () => {
        it('TC5 [Update Success] - Nên cập nhật sản phẩm thành công', () => {
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

        it('TC6 [Update Cancel] - Nên giữ nguyên khi hủy cập nhật', () => {
            productPage.clickEditOnProduct(testProduct.name)
            productPage.fillProductForm({ name: 'Temporary Name' })
            productPage.cancelForm()

            productPage.getProductInList(testProduct.name).should('exist')
            cy.contains('Temporary Name').should('not.exist')
        })
    })

    // === DELETE OPERATIONS ===
    describe('Delete Product Operations', () => {
        it('TC7 [Delete Cancel] - Nên hủy xóa sản phẩm', () => {
            productPage.clickDeleteOnProduct(testProduct.name)
            productPage.cancelDelete()

            productPage.getProductInList(testProduct.name).should('exist')
        })

        it('TC8 [Delete Success] - Nên xóa sản phẩm thành công', () => {
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
        it('TC9 [Search Functionality] - Nên tìm kiếm sản phẩm theo tên', () => {
            const searchTerm = "Laptop";
            productPage.searchProduct(searchTerm)

            productPage.getAllProductItems().each(($item) => {
                productPage.getProductNameInRow($item)
                    .invoke('text')
                    .should('include', searchTerm)
            })

            productPage.getSearchResultsCount().should('contain', 'Tìm thấy')
        })

        it('TC10 [Filter by Category] - Nên lọc sản phẩm theo danh mục', () => {
            productPage.filterByCategory('electronics')
            cy.wait(1000)

            cy.get('[data-testid="product-item"] .badge').each(($badge) => {
                cy.wrap($badge).should('contain', 'Điện tử')
            })
        })

        it('TC11 [Search No Results] - Nên hiển thị thông báo khi không tìm thấy kết quả', () => {
            productPage.searchProduct('NonexistentProductName12345')

            productPage.getNoResultsMessage().should('be.visible')
            productPage.getAllProductItems().should('not.exist')
        })

        it('TC12 [Combined Search and Filter] - Nên kết hợp tìm kiếm và lọc danh mục', () => {
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

        it('TC13 [Clear Search] - Nên hiển thị lại tất cả sản phẩm khi xóa tìm kiếm', () => {
            productPage.searchProduct('Laptop')
            productPage.clearSearch()

            productPage.getAllProductItems().should('have.length.at.least', 1)
            cy.contains('Tất cả danh mục').should('be.visible')
        })
    })
})