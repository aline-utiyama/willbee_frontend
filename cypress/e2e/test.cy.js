
describe('Navbar', () => {
  it('should display login and signup buttons on the homepage', () => {
    cy.visit('http://localhost:3000/');

    cy.get('button').contains('Login').should('be.visible');
    cy.get('button').contains('Signup').should('be.visible');
  });

  it('should display profile and logout buttons when logged in', () => {
    // Simulate login
    cy.visit('http://localhost:3000/dashboard');

    cy.get('button').contains('View notifications').should('be.visible');
    cy.get('button').contains('Open user menu').should('be.visible').click();

    cy.get('a').contains('Your Profile').should('be.visible');
    cy.get('a').contains('Settings').should('be.visible');
    cy.get('button').contains('Sign out').should('be.visible');
  });

  it('should navigate to the login page when logout is clicked', () => {
    // Simulate login
    cy.visit('http://localhost:3000/dashboard');

    cy.get('button').contains('Open user menu').click();
    cy.get('button').contains('Sign out').click();

    cy.url().should('include', '/login');
  });
});