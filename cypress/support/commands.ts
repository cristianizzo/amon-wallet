import 'cypress-localstorage-commands';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject = any> {
    customCommand(param: any): typeof customCommand;
  }
}

const customCommand = (param: any): void => {
  console.warn(param);
};

Cypress.Commands.overwrite('clearLocalStorage', () => {
  window.localStorage.clear();
});

Cypress.Commands.add('setLocalStorage', (key: string, value: string) => window.localStorage.setItem(key, value));

Cypress.Commands.overwrite('clearLocalStorage', () => {
  window.localStorage.clear();
});

// Cypress.Commands.add('readClipboard', () => new Cypress.Promise((resolve) => {
//
//   cy.window().its('navigator.clipboard')
//     .invoke('readText')
//     .then((text) => {
//       return resolve(text);
//     });
//   // cy.window().then((window) => {
//   //   window.navigator.clipboard.readText().then((text) => {
//   //     resolve(text);
//   //   });
//   // });
// }));

Cypress.Commands.add('readClipboard', () => cy.window().then((window) => window.navigator.clipboard.readText().then((text) => text)));

// Cypress.Commands.add('clickButton', (item: string) => new Cypress.Promise((resolve) => {
//   cy.get(item).click().then(() => resolve(true));
// }));

Cypress.Commands.add('clickButton', (buttonLabel: string) => cy.get(buttonLabel).click().then(() => true));
