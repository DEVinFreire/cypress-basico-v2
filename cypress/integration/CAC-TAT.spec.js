///<reference types="Cypress"/>

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;
  beforeEach(function () {
    cy.visit("./src/index.html");
  });
  it("verifica o titulo da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", function () {
    const longTest =
      "texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo, texto longo.";

    cy.clock();

    cy.get("#firstName").type("Nilton");
    cy.get("#lastName").type("Freire");
    cy.get("#email").type("nilton.freire@joyjet.com");
    cy.get("#open-text-area").type(longTest, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
    cy.clock();
    cy.get("#firstName").type("Nilton");
    cy.get("#lastName").type("Nilton");
    cy.get("#email").type("nilton.freire@joyjet,com");
    cy.get("#open-text-area").type("test");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("campo telefone continua vazio quando preenchido com valor não-numérico", function () {
    cy.get("#phone").type("abcdefghij").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
    cy.clock();
    cy.get("#firstName").type("Nilton");
    cy.get("#lastName").type("Nilton");
    cy.get("#email").type("nilton.freire@joyjet.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("test");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", function () {
    cy.get("#firstName")
      .type("Nilton")
      .should("have.value", "Nilton")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Freire")
      .should("have.value", "Freire")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("nilton.freire@joyjet.com")
      .should("have.value", "nilton.freire@joyjet.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("1234567890")
      .should("have.value", "1234567890")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
    cy.clock();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("Envia formulario com sucesso criando comandos customizados", function () {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("Seleciona um produto (youtube) pelo texto ", function () {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona o produto (mentoria) pelo seu valor", function () {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (blog) pelo seu indice", function () {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('Marca o tipo de atendimento "feedback"', function () {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("Marca cada tipo de atendimento", function () {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca último", function () {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", function () {
    cy.get('input[type="file"]#file-upload')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", function () {
    cy.get('input[type="file"]#file-upload')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", function () {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", function () {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", function () {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("Talking About Testing").should("be.visible");
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", function () {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preenche a area de texto usando o .invoke", function () {
    const longText = Cypress._.repeat("0123456789", 20);
    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("faz uma requisição HTTP", function () {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it.only("encontra o gato escondido", function () {
    cy.get("#cat").invoke("show").should("be.visible");
    cy.get("#title").invoke("text", "CAT TAT");
  });
});
