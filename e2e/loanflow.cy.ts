function openApplication(url = '/apply?amount=300000&months=60') {
  cy.visit(url);
  cy.contains('Loan details').should('be.visible');
  cy.get('[data-cy="continue"]').click();
  cy.contains('Your details').should('be.visible');
}

function completePersonalStep() {
  cy.get('#firstName').clear().type('Kamilla');
  cy.get('#lastName').clear().type('Kuanysheva');
  cy.get('#email').clear().type('kamilla@example.com');
  cy.get('#phone').clear().type('+420 777 123 456');
  cy.get('[data-cy="continue"]').click();
  cy.contains('Income and expenses').should('be.visible');
}

function completeFinanceStep() {
  cy.get('#monthlyIncome').clear().type('55000');
  cy.get('#monthlyExpenses').clear().type('22000');
  cy.get('[data-cy="continue"]').click();
  cy.contains('Review and submit').should('be.visible');
}

describe('LoanFlow production journeys', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('recalculates a loan and completes the full application journey', () => {
    cy.visit('/');

    cy.contains('Borrowing,').should('be.visible');
    cy.get('[data-cy="loan-amount"]').clear().type('300000');
    cy.get('[data-cy="loan-term"]').select('60');
    cy.get('[data-cy="monthly-payment"]').should('contain.text', 'Kč');

    cy.contains('Start application').click();
    cy.url().should('include', '/apply?amount=300000&months=60');

    cy.get('[data-cy="continue"]').click();
    completePersonalStep();
    completeFinanceStep();

    cy.contains('Kamilla Kuanysheva').should('be.visible');
    cy.get('[data-cy="submit"]').click();

    cy.url().should('match', /\/status\/LF-/);
    cy.contains('Application received').should('be.visible');
    cy.get('[data-cy="application-reference"]').should('contain.text', 'LF-');
  });

  it('blocks invalid personal data and exposes accessible validation state', () => {
    openApplication();

    cy.get('#email').type('invalid-email');
    cy.get('[data-cy="continue"]').click();

    cy.contains('Enter at least 2 characters').should('be.visible');
    cy.get('#firstName').should('have.attr', 'aria-invalid', 'true');
    cy.get('#firstName').should('have.attr', 'aria-describedby', 'firstName-error');
    cy.get('#firstName-error').should('have.attr', 'role', 'alert');
    cy.contains('Income and expenses').should('not.exist');
  });

  it('keeps the draft and shows a recoverable service-error state', () => {
    openApplication('/apply?amount=300000&months=60&simulate=error');
    completePersonalStep();
    completeFinanceStep();

    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="submission-error"]').should('be.visible');
    cy.contains('Your draft is still saved').should('be.visible');
    cy.get('[data-cy="submit"]').should('contain.text', 'Try again').and('be.enabled');
    cy.url().should('include', '/apply');
  });
});
