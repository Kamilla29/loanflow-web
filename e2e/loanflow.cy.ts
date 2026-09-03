function completeLoanStep() { cy.get('[data-cy="continue"]').click(); }
function completePersonalStep() {
  cy.get('#firstName').clear().type('Kamilla'); cy.get('#lastName').clear().type('Example'); cy.get('#email').clear().type('kamilla@example.com'); cy.get('#phone').clear().type('+420 777 123 456'); cy.get('[data-cy="continue"]').click();
}
function completeFinancesStep() { cy.get('#monthlyIncome').clear().type('55000'); cy.get('#monthlyExpenses').clear().type('24000'); cy.get('[data-cy="continue"]').click(); }

describe('LoanFlow portfolio journeys', () => {
  beforeEach(() => { cy.clearLocalStorage(); });
  it('recalculates a loan and completes the full application journey', () => {
    cy.visit('/'); cy.contains('Borrowing,').should('be.visible'); cy.get('[data-cy="loan-amount"]').clear().type('300000'); cy.get('[data-cy="loan-term"]').select('60'); cy.get('[data-cy="monthly-payment"]').should('contain.text','Kč'); cy.contains('Start application').click(); cy.url().should('include','/apply?amount=300000&months=60');
    completeLoanStep(); completePersonalStep(); completeFinancesStep(); cy.contains('Review and submit').should('be.visible'); cy.get('[data-cy="submit"]').click(); cy.url().should('include','/status/LF-'); cy.get('[data-cy="application-reference"]').should('contain.text','LF-');
  });
  it('focuses invalid fields and blocks progression', () => {
    cy.visit('/apply'); completeLoanStep(); cy.get('#email').type('wrong'); cy.get('[data-cy="continue"]').click(); cy.get('#firstName').should('be.focused'); cy.contains('Enter at least 2 characters').should('be.visible');
  });
  it('keeps the draft after a simulated service failure', () => {
    cy.visit('/apply?simulate=error'); completeLoanStep(); completePersonalStep(); completeFinancesStep(); cy.get('[data-cy="submit"]').click(); cy.get('[data-cy="submission-error"]').should('be.visible'); cy.reload(); cy.contains('Your loan').should('be.visible'); cy.get('[data-cy="continue"]').click(); cy.get('#firstName').should('have.value','Kamilla');
  });
  it('renders the component showcase', () => { cy.visit('/components'); cy.contains('Component showcase').should('be.visible'); cy.contains('Buttons').should('be.visible'); cy.contains('Progress').should('be.visible'); });
});
