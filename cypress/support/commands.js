Cypress.Commands.add("fillMandatoryFieldsAndSubmit", function () {
  cy.get("#firstName").type("Nilton");
  cy.get("#lastName").type("Nilton");
  cy.get("#email").type("nilton.freire@joyjet.com");
  cy.get("#open-text-area").type("teste");
  cy.contains("button", "Enviar").click();
});
