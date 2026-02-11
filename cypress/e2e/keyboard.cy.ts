describe('Keyboard events', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="game-board"]').should('be.visible');
  });

  const keys = [
    { key: 'ArrowUp', code: 'ArrowUp' },
    { key: 'ArrowDown', code: 'ArrowDown' },
    { key: 'ArrowLeft', code: 'ArrowLeft' },
    { key: 'ArrowRight', code: 'ArrowRight' },
    { key: 'w', code: 'KeyW' },
    { key: 'a', code: 'KeyA' },
    { key: 's', code: 'KeyS' },
    { key: 'd', code: 'KeyD' },
  ];

  keys.forEach(({ key, code }) => {
    it(`handles ${key} (${code}) without error and board remains visible`, () => {
      cy.get('body').trigger('keydown', { key, code });
      cy.get('[data-testid="game-board"]').should('be.visible');
    });
  });

  it('handles multiple arrow keys in sequence', () => {
    cy.get('body').trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp' });
    cy.get('body').trigger('keydown', { key: 'ArrowRight', code: 'ArrowRight' });
    cy.get('body').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    cy.get('body').trigger('keydown', { key: 'ArrowLeft', code: 'ArrowLeft' });
    cy.get('[data-testid="game-board"]').should('be.visible');
  });

  it('handles WASD keys in sequence', () => {
    cy.get('body').trigger('keydown', { key: 'w', code: 'KeyW' });
    cy.get('body').trigger('keydown', { key: 'd', code: 'KeyD' });
    cy.get('body').trigger('keydown', { key: 's', code: 'KeyS' });
    cy.get('body').trigger('keydown', { key: 'a', code: 'KeyA' });
    cy.get('[data-testid="game-board"]').should('be.visible');
  });
});
