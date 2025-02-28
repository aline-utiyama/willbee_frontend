describe('Login Page', () => {
  it('should display the login form', () => {
    cy.visit('http://localhost:3000/login');

    cy.get('input[name="Email address"]').should('be.visible');
    cy.get('input[name="Password"]').should('be.visible');
    cy.get('button').contains('Login').should('be.visible');
  });

  it('should display an error message for invalid credentials', () => {
    cy.visit('http://localhost:3000/login');

    cy.get('input[name="Email address"]').type('invalid@example.com');
    cy.get('input[name="Password"]').type('invalidpassword');
    cy.get('button').contains('Login').click();

    cy.get('div').contains('Invalid email or password').should('be.visible');
  });
});
