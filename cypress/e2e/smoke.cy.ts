describe('Homepage smoke', () => {
  it('renders hero content and partner video block', () => {
    cy.visit('/')

    cy.contains('h1', 'UK Greeting Card & Gift Sales Agent Covering East Anglia').should('exist')

    cy.get('#partner-brands').scrollIntoView()
    cy.get('#partner-brands video').should('have.length.at.least', 1)
  })
})
