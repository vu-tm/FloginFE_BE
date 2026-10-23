describe('Render smoke test', () => {
  it('logs in and loads products without changing data', () => {
    cy.intercept('POST', '**/api/login').as('login')
    cy.intercept('GET', '**/api/products').as('products')
    cy.visit('/login')
    cy.get('[data-testid="username-input"]').type('testuser')
    cy.get('[data-testid="password-input"]').type('Test@123', { log: false })
    cy.get('[data-testid="login-button"]').click()
    cy.wait('@login').its('response.statusCode').should('eq', 200)
    cy.location('pathname').should('eq', '/products')
    cy.wait('@products').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      expect(response.body).to.be.an('array')
    })
    cy.get('table').should('be.visible')
  })
})
