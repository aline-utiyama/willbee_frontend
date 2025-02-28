describe('Goal Plans List Page', () => {
  it('should display the goal plans list', () => {
    cy.visit('http://localhost:3000/goal-plans/list');

    cy.get('h1').contains('All Plans').should('be.visible');
    cy.get('div').contains('Goal Plan').should('be.visible');
  });

  it('should navigate to the goal plan details page when a goal plan is clicked', () => {
    cy.visit('http://localhost:3000/goal-plans/list');

    cy.get('div').contains('Goal Plan').click();

    cy.url().should('include', '/goal-plans/');
    cy.get('h1').contains('Goal Plan Details').should('be.visible');
  });
});
