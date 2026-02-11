describe('Suggestion (mocked API)', () => {
  const mockResponse = {
    recommended: 'UP',
    reasoning: 'Moving up will merge the tiles and free space.',
  };

  beforeEach(() => {
    cy.intercept('POST', '**/prompt', {
      statusCode: 200,
      body: mockResponse,
    }).as('getSuggestion');

    cy.visit('/');
    cy.get('[data-testid="suggest-button"]').should('be.visible');
  });

  it('shows suggest button and response container', () => {
    cy.get('[data-testid="suggest-button"]').should('be.visible').and('contain', 'Suggest a Move');
  });

  it('after clicking suggest button, mocked response text appears', () => {
    cy.get('[data-testid="suggest-button"]').click();

    cy.wait('@getSuggestion');

    // Recommended label for UP from the app's MOVE_SUGGESTION map
    cy.get('[data-testid="suggestion-response"]').within(() => {
      cy.contains('⬆️ Move Up!').should('be.visible');
      cy.contains(mockResponse.reasoning).should('be.visible');
    });
  });

  it('sends board values in the API request', () => {
    cy.get('[data-testid="suggest-button"]').click();

    cy.wait('@getSuggestion').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body).to.have.property('boardValues');
      expect(interception.request.body.boardValues).to.be.an('array');
    });
  });
});
