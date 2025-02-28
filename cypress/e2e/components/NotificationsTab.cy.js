describe('NotificationsTab', () => {
  beforeEach(() => {
    // Simulate login
    cy.visit('http://localhost:3000/dashboard');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign in').click();
    cy.get('button').contains('View notifications').click({ force: true });
  });

  it('should display notifications when the bell icon is clicked', () => {
    cy.get('button').contains('View').should('be.visible');
    cy.get('button').contains('Mark as Completed').should('be.visible');
  });
});
