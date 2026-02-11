describe('UI elements', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has the game title', () => {
    cy.contains('h1', '2048').should('be.visible');
  });

  it('has the game board with test id', () => {
    cy.get('[data-testid="game-board"]').should('be.visible');
  });

  it('has the suggest button with test id', () => {
    cy.get('[data-testid="suggest-button"]').should('be.visible').and('contain', 'Suggest a Move');
  });
});
