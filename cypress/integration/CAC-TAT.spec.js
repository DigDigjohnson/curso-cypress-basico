/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const timer = 3000
    beforeEach(function () {
        cy.visit('./src/index.html')
    })
    it('verifica o titulo da aplicacao', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
    Cypress._.times(5, function () {
        it('preenche os campos obrigatorios e envia o formulario', function () {
            const longText = 'Texto longo para teste de insercao de grandes quantidades de caracteres dentro do campo de texto com delay modificado na insercao'

            cy.clock()

            cy.get('#firstName').type('Rodrigo')
            cy.get('#lastName').type('Lehnen')
            cy.get('#email').type('rodrigoomlehnen@gmail.com')
            cy.get('#open-text-area').type(longText, { delay: 0 })
            cy.contains('button', 'Enviar').click()
            cy.get('.success').should('be.visible')

            cy.tick(timer)

            cy.get('.success').should('not.be.visible')
        })
    })
    it('exibe mensagem de erro ao submeter o formulario com um email com formatacao invalida', function () {
        const longText = 'Texto longo para teste de insercao de grandes quantidades de caracteres dentro do campo de texto com delay modificado na insercao'

        cy.clock()

        cy.get('#firstName').type('Rodrigo')
        cy.get('#lastName').type('Lehnen')
        cy.get('#email').type('rodrigoomlehnengmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(timer)
        cy.get('.error').should('not.be.visible')
    })
    it('validar se o campo de telefone nao aceita caracteres nao-numericos', function () {

        cy.get('#phone').type('Rodrigo').should('not.have.text')
        cy.get('#phone').type('!@#$%¨&*()_-+=').should('not.have.text')
    })
    it('exibe mensagem de erro quando o telefone se torna obrigatorio mas nao e preenchido antes do envio do formulario', function () {

        cy.clock()

        cy.get('#phone-checkbox').check()
        cy.get('.phone-label-span').should('be.visible')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(timer)
        cy.get('.error').should('not.be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        const longText = 'Texto longo para teste de insercao de grandes quantidades de caracteres dentro do campo de texto com delay modificado na insercao'

        cy.get('#firstName').type('Rodrigo').should('have.value', 'Rodrigo').clear().should('have.value', '')
        cy.get('#lastName').type('Lehnen').should('have.value', 'Lehnen').clear().should('have.value', '')
        cy.get('#email').type('rodrigoomlehnen@gmail.com').should('have.value', 'rodrigoomlehnen@gmail.com').clear().should('have.value', '')
        cy.get('#open-text-area').type(longText, { delay: 0 }).should('have.value', longText).clear().should('have.value', '')
    })
    it('exibe mensagem de erro ao submeter o formulario sem preencher os campos obrigatorios', function () {

        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(timer)
        cy.get('.error').should('not.be.visible')
    })
    it('envia o formulario com sucesso usando um comando customizado', function () {

        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        cy.tick(timer)
        cy.get('.success').should('not.be.visible')
    })
    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('select').select('YouTube').should('have.value', 'youtube')
    })
    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('select').select('mentoria').should('have.value', 'mentoria')
    })
    it('seleciona um produto (Blog) por seu indice', function () {
        cy.get('select').select(1).should('have.value', 'blog')
    })
    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type = "radio"][value="feedback"]').check()
    })
    it('marca cada tipo de atendimento', function () {
        cy.get('input[type = "radio"]').should('have.length', 3).each(function ($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })
    it('marca ambos checkboxes, depois desmarca o ultimo', function () {
        cy.get('#check input[type="checkbox"]').as('checkboxes').check()
        cy.get('@checkboxes').each(checkbox => { expect(checkbox[0].checked).to.equal(true) })
        cy.get('#check input[type="checkbox"]').last().uncheck().should('not.be.checked')
    })
    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]').should('not.have.value').selectFile('cypress/fixtures/example.json')
            .should(function ($input) {
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]').should('not.have.value').selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('arquivo')
        cy.get('input[type="file"]').should('not.have.value').selectFile('@arquivo')
            .should(function ($input) {
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
    it('verifica que a politica de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('a').should('have.attr', 'target', '_blank')
    })
    it('acessa a pagina da politica de privacidade removendo o target e entao clicando no link', function () {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.contains('Talking About Testing').should('be.visible')
    })
    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function () {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatorios!')
            .invoke('hide')
            .should('not.be.visible')
    })
    it('preenche a area de texto usando o comando invoke', function () {
        const longText = 'Texto longo para teste de insercao de grandes quantidades de caracteres dentro do campo de texto com delay modificado na insercao'

        cy.clock()

        cy.get('#firstName').type('Rodrigo')
        cy.get('#lastName').type('Lehnen')
        cy.get('#email').type('rodrigoomlehnen@gmail.com')
        cy.get('#open-text-area').invoke('val', longText).should('have.value', longText)
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')

        cy.tick(timer)

        cy.get('.success').should('not.be.visible')
    })

    it('faz uma requisicao HTTP', function () {
        cy.request('GET', 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .then(function (response) {
                expect(response.status).to.equal(200);
                expect(response.statusText).to.equal('OK');
                expect(response.body).include('CAC TAT')
        })
    })
    it('Encontre o Gato', function () {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
    })
})