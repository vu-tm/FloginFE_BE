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
        return cy.contains('[data - testid="product-item"]', name);
    }
}

export default ProductPage