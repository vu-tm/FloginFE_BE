/**
* cy.visit(): Cypress mở 1 url cụ thể
* cy.click: Click phần tử đã chọn
* cy.get(): chọn phần tử dựa trên selector (class, id, tag…)
* cy.type(): Nhập text vào input/textarea
* cy.select(): Chọn giá trị trong dropdown
* have.value: kiểm tra nội dung trong input/textarea/select
* cy.should(): xác nhận giá trị của input có đúng văn bản đã nhập hay không
* cy.contains(): Tìm kiếm phần tử chứa văn bản cụ thể
* Tìm không thấy thì cypress sẽ tìm liên tục trong 4 giây rồi mới báo lỗi
**/

class ProductPage {
    visit() {
        cy.visit('/products')
    }

    // --- Các hành động trên trang chính ---
    clickAddNew() {
        cy.get('[data-testid="add-product-btn"]').click()
    }

    // --- Lấy phần tử ---
    getModal() {
        return cy.get('.modal-overlay')
    }

    getTableRow(productName) {
        return cy.contains('[data-testid="product-item"]', productName)
    }

    getErrorMessage() {
        return cy.get('[data-testid="error-message"]', { timeout: 10000 })
    }
    getSuccessMessage() {
        return cy.get('[data-testid="success-message"]', { timeout: 10000 })
    }

    // --- Các hành động trong Form (Modal) ---
    fillProductForm(product) {
        this.getModal().within(() => {
            if (product.name) {
                cy.get('[data-testid="product-name"]')
                    .clear()
                    .type(product.name)
            }
            if (product.price) {
                cy.get('[data-testid="product-price"]')
                    .clear()
                    .type(product.price)
            }
            if (product.quantity) {
                cy.get('[data-testid="product-quantity"]')
                    .clear()
                    .type(product.quantity)
            }
            if (product.category) {
                cy.get('select').select(product.category)
            }
        })
    }

    submitForm() {
        this.getModal().within(() => {
            cy.get('[data-testid="submit-btn"]').click()
        })
    }

    cancelForm() {
        this.getModal().within(() => {
            cy.get('.btn-secondary').contains('Hủy').click()
        })
    }

    getFormValidationError() {
        // Kiểm tra validation message của browser
        return cy.get('[data-testid="product-name"]:invalid')
    }

    // --- Các hành động trên Hàng (Row) ---
    clickEditOnProduct(productName) {
        this.getTableRow(productName).within(() => {
            cy.get('[data-testid="edit-product-btn"]').click()
        })
    }

    clickDeleteOnProduct(productName) {
        this.getTableRow(productName).within(() => {
            cy.get('[data-testid="delete-product-btn"]').click()
        })
    }

    clickViewDetailOnProduct(productName) {
        this.getTableRow(productName).within(() => {
            cy.get('[data-testid="view-detail-btn"]').click()
        })
    }

    // --- Các hành động trong Modal Detail ---
    closeDetailModal() {
        cy.get('.btn-close-detail').click()
    }
    confirmDelete() {
        cy.on('window:confirm', () => true)
    }
    cancelDelete() {
        cy.on('window:confirm', () => false)
    }
    // --- Helper methods ---
    getProductInList(name) {
        return cy.contains('[data-testid="product-item"]', name, { timeout: 10000 })
    }
    // --- SEARCH/FILTER METHODS ---
    searchProduct(searchTerm) {
        cy.get('input[type="text"]')
            .clear()
            .type(searchTerm)
    }
    clearSearch() {
        cy.get('input[type="text"]')
            .clear()
    }
    filterByCategory(category) {
        cy.get('select').select(category)
    }
    getSearchResultsCount() {
        return cy.contains('Tìm thấy').invoke('text')
    }

    getNoResultsMessage() {
        return cy.contains('Không tìm thấy sản phẩm nào phù hợp')
    }

    getAllProductItems() {
        return cy.get('[data-testid="product-item"]')
    }

    getProductNameInRow($row) {
        return cy.wrap($row).find('[data-testid="product-name"]')
    }

    getProductCategoryInRow($row) {
        return cy.wrap($row).find('.badge')
    }

    // --- VALIDATION ERROR METHODS ---
    getFieldError(field) {
        return cy.get(`[data-testid="${field}-error"]`)
    }

    shouldShowFieldError(field, expectedError) {
        this.getFieldError(field)
            .should('be.visible')
            .and('contain', expectedError)
    }

    shouldNotShowFieldError(field) {
        this.getFieldError(field).should('not.exist')
    }

    getErrorInput(field) {
        return cy.get(`[data-testid="${field}-error"]`).prev()
    }
}

export default ProductPage