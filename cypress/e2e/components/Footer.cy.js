describe('Footer', () => {
  it('should display the footer content', () => {
    cy.visit('http://localhost:3000/');

    cy.get('footer').should('be.visible');
    cy.get('footer').contains('© 2025 WillBee. All rights reserved.').should('be.visible');
  });
});
