describe('Signup Page', () => {
  it('should display the signup form', () => {
    cy.visit('http://localhost:3000/signup');

    cy.get('input[name="Email address"]').should('be.visible');
    cy.get('input[name="Password"]').should('be.visible');
    cy.get('input[name="Confirm Password"]').should('be.visible');
    cy.get('button').contains('Signup').should('be.visible');
  });

  it('should display an error message for mismatched passwords', () => {
    cy.visit('http://localhost:3000/signup');

    cy.get('input[name="Email address"]').type('test@example.com');
    cy.get('input[name="Password"]').type('password123');
    cy.get('input[name="Confirm Password"]').type('password456');
    cy.get('button').contains('Signup').click();

    cy.get('div').contains('Passwords do not match').should('be.visible');
  });
});
