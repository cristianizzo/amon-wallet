import '../support/commands';

describe('Start App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Setup language', async () => {
    cy.contains('decentralized crypto wallet');
    cy.contains('Select Language');
    cy.get('#it').click();
    cy.get('#en').click();
    cy.get('#btn-continue').click();
    cy.url().should('include', '/welcome');

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'langSelected')
      .should('contain', '1');

    cy.window()
      .its('localStorage')
      .invoke('getItem', 'language')
      .should('contain', 'en');
  });

  it('Welcome', async () => {
    cy.get('#en').click();
    cy.get('#btn-continue').click();
    cy.url().should('include', '/welcome');
  });
});
