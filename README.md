# Banco Digital - API RESTful
Bem-vindo ao projeto do Banco Digital desenvolvido como parte do meu curso na CUBOS! Este é meu primeiro projeto/portfólio, e estou animado em compartilhá-lo com vocês. Este projeto é um sistema bancário simples baseado em uma API RESTful, com planos de expansão futura.

## Descrição

Este projeto é uma implementação de uma API RESTful que permite realizar operações bancárias básicas, como criar uma conta bancária, listar contas, depositar, sacar, transferir fundos, consultar saldo e emitir extratos. O projeto é construído seguindo os princípios do estilo arquitetural REST (Representational State Transfer). O projeto está ativo e em desenvolvimento contínuo. Novos recursos e melhorias serão adicionados regularmente, assim como a integração com um banco de dados PostgreSQL no futuro.

## Funcionalidades
Criar conta bancária

Listar contas bancárias

Atualizar dados do usuário da conta bancária

Excluir uma conta bancária

Depositar em uma conta bancária

Sacar de uma conta bancária

Transferir valores entre contas bancárias

Consultar saldo da conta bancária

Emitir extrato bancário

## Persistência dos Dados

Os dados do banco são mantidos em memória, usando um objeto no arquivo bancodedados.js. Todas as transações e contas bancárias são registradas dentro deste objeto.

### A API responde com os seguintes status codes:

200 (OK)

201 (Created)

204 (No Content)

400 (Bad Request)

401 (Unauthorized)

403 (Forbidden)

404 (Not Found)

## Rotas e Descrições

Aqui estão as principais rotas da API e suas descrições:

### Listar contas bancárias

`GET /contas?senha_banco=123Bank`

Esta rota permite listar todas as contas bancárias existentes. Para acessar esta rota, é necessário fornecer a senha do banco como um parâmetro de consulta. A resposta incluirá informações sobre as contas, como número de conta e saldo.

### Criar conta bancária

`POST /contas`

Use esta rota para criar uma nova conta bancária. Você deve fornecer os detalhes do usuário, como nome, CPF, data de nascimento, telefone, e-mail e senha no corpo da solicitação. O saldo inicial da conta será definido como zero.

### Atualizar usuário da conta bancária

`PUT /contas/:numeroConta/usuario`

Esta rota permite atualizar os detalhes do usuário de uma conta bancária específica. Você deve fornecer todos os campos de informações do usuário no corpo da solicitação. A rota verificará se o CPF ou o e-mail já existem em outras contas e retornará um erro, se aplicável.

### Excluir conta

`DELETE /contas/:numeroConta`

Use esta rota para excluir uma conta bancária existente. A conta só pode ser removida se o saldo for igual a zero. Certifique-se de fornecer o número da conta na URL.

### Depositar

`POST /transacoes/depositar`

Esta rota permite depositar dinheiro em uma conta bancária. Forneça o número da conta e o valor a ser depositado no corpo da solicitação. Certifique-se de não depositar valores negativos ou zerados.

### Sacar

`POST /transacoes/sacar`

Use esta rota para sacar dinheiro de uma conta bancária. Forneça o número da conta, o valor a ser sacado e a senha no corpo da solicitação. O valor não pode ser menor que zero.

Transferir

`POST /transacoes/transferir`

Esta rota permite transferir dinheiro de uma conta para outra. Forneça o número da conta de origem, o número da conta de destino, o valor a ser transferido e a senha no corpo da solicitação. A rota verificará se há saldo disponível na conta de origem.

### Consultar saldo

`GET /contas/saldo?numero_conta=123&senha=123`

Use esta rota para consultar o saldo de uma conta bancária. Forneca o número da conta e a senha como parâmetros de consulta. A rota retornará o saldo da conta.

### Emitir extrato

`GET /contas/extrato?numero_conta=123&senha=123`

Esta rota permite emitir um extrato bancário com informações detalhadas sobre as transações de uma conta bancária específica. Forneca o número da conta e a senha como parâmetros de consulta. O extrato incluirá informações sobre depósitos, saques e transferências.

## Como Usar

Clone este repositório.

Instale as dependências usando npm install.

Execute o servidor com npm start.

Acesse a API em http://localhost:3000.

## Agradecimentos

Gostaria de expressar minha sincera gratidão ao iFood por fornecer a bolsa de estudos que tornou possível minha participação no curso da CUBOS Academy. Este projeto é resultado do meu aprendizado contínuo adquirido durante esse curso e de minha faculdade, e sem dúvidas é um marco muito importante em minha jornada de desenvolvimento!
