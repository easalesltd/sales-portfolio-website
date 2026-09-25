describe('Homepage smoke', () => {
  it('renders the campaign homepage and closer actions', () => {
    cy.visit('/')

    cy.contains('h1', 'UK Greeting Card & Gift Sales Agent Covering East Anglia').should('exist')
    cy.get('.home-test-hero img').should('have.length.at.least', 1)
    cy.contains('button', 'Request an agent visit').should('exist')
    cy.get('.home-test-actions').contains('About Dave').should('have.attr', 'href', '/about')
  })
})
