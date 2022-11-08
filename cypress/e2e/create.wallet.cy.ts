import promisify from 'cypress-promise';
import '../support/commands';
import { UtilsHelper } from '@app/helpers/utils';

describe('Create Wallet', () => {
  beforeEach(() => {
    cy.setLocalStorage('langSelected', '1');
    cy.setLocalStorage('language', 'en');
    cy.visit('/welcome');
  });

  it('SeedPhrase', async () => {
    cy.get('#btn-create-wallet').click();
    cy.url().should('include', '/pick-password');

    cy.get('#password')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'));

    cy.get('#submit').click();

    cy.get('#confirmPassword')
      .type(Cypress.env('password'))
      .should('have.value', Cypress.env('password'));

    cy.get('#submit').click();

    cy.url().should('include', '/seed-phrase');
    cy.clickButton('#copy');
    cy.clickButton('#btn-seedPhrase');

    // console.log(1);
    // const rawSeed = cy.readClipboard();
    // console.log(2, rawSeed);

    // const rawSeed = await promisify(cy.window()
    //   .its('navigator.clipboard')
    //   .invoke('readText'));

    // const seed = rawSeed.replace(/#[0-9]?([0-9])[\s]/g, '')
    //   .replace(/\s\s/g, ',')
    //   .replace(/.$/, '')
    //   .split(',');
    //
    // const verifyPhrases = new UtilsHelper().splitArrayIntoChunks(seed, 3);
    // console.log(verifyPhrases);

    // const a = cy.get('.verifyPhrases');
    // console.log(a);

    // cy.get('.verifyPhrases')
    //   .find('ion-chip')
    //   .each((boxPhrases, index) => {
    //     console.log(1, boxPhrases, index);
    //   });

    // cy.get('.verifyPhrases').eq(0)
    //   .find('ion-chip')
    //   .then((items) => {
    //     console.log(1, items);
    //   });

    // const a = await promisify(cy
    //   .get('.verifyPhrases')
    //   .then($el => $el)
    // );
    //
    // console.log(a);
    //
    // console.log(seed);
    // let correctWord = false;
    // cy.get('.verifyPhrases').eq(0)
    //   .find('ion-chip')
    //   .then((items) => {
    //
    //     cy.wrap(boxPhrases).click().then(() => {
    //     });
    //
    //     console.log(items)
    //     // cy.wrap(items[0]).get('ion-chip').then( (chip) => {
    //     //   console.log(chip);
    //     // });
    //
    //     // cy.wrap(items).click().then(() => {});
    //
    //   });

    // console.log(cy.get('.verifyPhrases');
    // cy.get('.verifyPhrases')
    //   .find('ion-chip')
    //   .each((boxPhrases, index) => {
    //
    //     // return new Cypress.Promise((resolve) => {
    //     //   setTimeout(() => {
    //     //     resolve()
    //     //   }, num * 100)
    //     // })
    //
    //     if (!correctWord) {
    //       // console.log('c', boxPhrases.get(0));
    //       // console.log(correctWord, index)
    //       cy.wrap(boxPhrases).click().then(() => {
    //
    //         if (boxPhrases.hasClass('success')) {
    //           correctWord = true;
    //           console.log('has class', correctWord, index);
    //         } else {
    //           console.log('not class', correctWord, index);
    //         }
    //       });
    //     }
    //
    //
    //     // if(!correctWord) {
    //     //   console.log(boxPhrases.get(0));
    //     //
    //     //   const i = index+1;
    //     //   cy.wrap(boxPhrases).click();
    //     //   cy.wait(5000);
    //
    //     // console.log(boxPhrases.get(0).classList.contains('success'));
    //     // if (boxPhrases.get(0).classList.contains('success')) {
    //     //   correctWord = true;
    //     //   console.log(boxPhrases.get(0));
    //     //   return false;
    //     // }
    //
    //     // correctWord = true;
    //     // console.log(boxPhrases.get(0));
    //     // }
    //
    //
    //     // cy.wrap(boxPhrases).get('ion-chip')
    //     //   .each((chip, index) => {
    //     //     console.log(chip.get(0));
    //     //
    //     //     // cy.wrap(chip).click().then(() => {
    //     //     //   console.log(chip.get(0));
    //     //     // });
    //     //   });
    //   });

    // cy.get('.verifyPhrases').children('ion-chip').each(($el, index) => {
    //
    //   const i = index+1;
    //   // console.log(i, correctWord, i % 3 === 0)
    //
    //   if (!correctWord) {
    //     cy.wrap($el).click().then(() => {
    //       console.log($el.get(0))
    //       if ($el.get(0).classList.contains('success')) {
    //         correctWord = true;
    //         // console.log('correct');
    //         console.log(i, 'correct', correctWord, i % 3 === 0)
    //       } else {
    //         // console.log('not correct');
    //         console.log(i, 'not correct', correctWord, i % 3 === 0)
    //       }
    //     });
    //   }
    //
    //   if (i % 3 === 0) {
    //     correctWord = false;
    //     console.log('reset');
    //   }
    //   // console.log(cy.wrap($el).should('have.class', 'container'));
    //   // console.log(cy.wrap($el).contains('.success').invoke('text'))
    // });

    // cy.get('.verifyPhrases')
    //   .each($abTest => {
    //     cy.wrap($abTest).click();
    //     console.log(cy.wrap($abTest).contains('.success'));
    //   });

    // cy.get('#verifyPhrases')
    //   .find('.cy-valid').each(($opn) => {
    //   const optionText = $opn.text();
    //   console.log(optionText);
    // const urlText = optionText.replace('.','_')
    //
    // cy.get('#version-select')
    //   .select(optionText)                 // select the option
    //
    // cy.url().should("include", urlText)
    // });
    // console.log(cy.get('.cy-valid').children().)
  });
});
