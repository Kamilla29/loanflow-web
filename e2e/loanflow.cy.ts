describe('LoanFlow core journey', () => {
  it('recalculates a loan and opens the application flow', () => {
    cy.visit('/');

    cy.contains('Borrowing,').should('be.visible');
    cy.get('[data-cy="loan-amount"]').clear().type('300000');
    cy.get('[data-cy="loan-term"]').select('60');
    cy.get('[data-cy="monthly-payment"]').should('contain.text', 'Kč');

    cy.contains('Start application').click();
    cy.url().should('include', '/apply?amount=300000&months=60');
    cy.contains('Your loan').should('be.visible');
    cy.contains('Continue').should('be.enabled');
  });
});
