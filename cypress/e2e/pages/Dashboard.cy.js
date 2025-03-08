describe('Dashboard Page', () => {
  it('should display the dashboard content', () => {
    cy.visit('http://localhost:3000/dashboard');

    cy.get('h1').contains('Dashboard').should('be.visible');
    cy.get('a').contains('My Goals').should('be.visible');
    cy.get('a').contains('Goal Plans').should('be.visible');
  });
});
