describe('Navbar', () => {
  it('should display login and signup buttons on the homepage', () => {
    cy.visit('http://localhost:3000/dashboard');

    cy.get('a').contains('Login').should('be.visible');
    cy.get('a').contains('Signup').should('be.visible');
  });

  it('should navigate to the login page when the login button is clicked', () => {
    cy.visit('http://localhost:3000/');

    cy.get('a').contains('Login').click();

    cy.url().should('include', '/login');
    cy.get('label').contains('Email address').should('be.visible');
    cy.get('label').contains('Password').should('be.visible');
  });

  it('should display profile and logout buttons when logged in', () => {
    // Simulate login
    cy.visit('http://localhost:3000/dashboard');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign in').click();

    cy.get('button').contains('Open user menu').should('be.visible').click({ force: true });

    cy.get('button').contains('Home').should('be.visible');
    cy.get('button').contains('My Goals').should('be.visible');
    cy.get('button').contains('Goal Plans').should('be.visible');
    cy.get('button').contains('User Settings').should('be.visible');
    cy.get('button').contains('WillBlog').should('be.visible');
    cy.get('button').contains('Help & Support').should('be.visible');
    cy.get('button').contains('Sign out').should('be.visible');
  });

  it('should display notifications when the bell icon is clicked', () => {
    // Simulate login
    cy.visit('http://localhost:3000/dashboard');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign in').click();

    cy.get('button').contains('View notifications').click({ force: true });
    cy.get('button').contains('View').should('be.visible');
    cy.get('button').contains('Mark as Completed').should('be.visible');
  });

  it('should navigate to the login page when logout is clicked', () => {
    // Simulate login
    cy.visit('http://localhost:3000/dashboard');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button').contains('Sign in').click();

    cy.get('button').contains('Open user menu').click({ force: true });
    cy.get('button').contains('Sign out').click();

    cy.url().should('include', '/login');
  });
});