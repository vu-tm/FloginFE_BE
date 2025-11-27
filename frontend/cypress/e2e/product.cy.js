import ProductPage from '../PageObjects/ProductPage.js'

describe('Product E2E Tests', () => {
    const productPage = new ProductPage()

    beforeEach(() => {
        cy.login('testuser', 'Test@123')
        cy.wait(500)
        productPage.visit()
    })

    it('should create new product successfully', () => {
        productPage.clickAddNew()
        productPage.fillProductForm({
            name: 'Laptop Dell',
            price: '15000000',
            quantity: '10'
        })
        productPage.submitForm()

        productPage.getSuccessMessage()
            .should('contain', 'thành công')
        productPage.getProductInList('Laptop Dell')
            .should('exist');
    })
})