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

    clickAddNew() {
        cy.get('[data-testid="add-product-btn"]').click()
    }

    fillProductForm(product) {
        cy.get('[data-testid="product-name"]').type(product.name)
        cy.get('[data-testid="product-price"]').type(product.price)
        cy.get('[data-testid="product-quantity"]').type(product.quantity)
    }

    submitForm() {
        cy.get('[data-testid="submit-btn"]').click()
    }

    getSuccessMessage() {
        return cy.get('[data-testid="success-message"]')
    }

    getProductInList(name) {
        return cy.contains('[data-testid="product-item"]', name);
    }
}

export default ProductPage;