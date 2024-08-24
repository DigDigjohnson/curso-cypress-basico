Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('Rodrigo')
    cy.get('#lastName').type('Lehnen')
    cy.get('#email').type('rodrigoomlehnen@gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})

