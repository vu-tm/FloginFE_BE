// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Handle native dialogs only inside the test browser, including after redirects.
beforeEach(() => {
  const alert = cy.stub().as('alert')
  cy.on('window:before:load', win => {
    win.alert = alert
    win.confirm = () => true
  })
})
