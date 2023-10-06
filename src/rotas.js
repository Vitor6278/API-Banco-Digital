const express = require("express");
const rotas = express();
const {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  depositar,
  sacar,
  transferir,
  consultaDeSaldo,
  consultarExtrato,
} = require("./controladores/controladores");

const {
  validarDados,
  validarSenha,
  validarDadosObrigatorios,
  validarSaldo,
  validarTransacao,
  validarSaque,
  validarTransferencia,
  validarContaeSenha,
} = require("./intermediarios");

rotas.get("/contas", validarSenha, listarContas);

rotas.post("/contas", validarDadosObrigatorios, criarConta);

rotas.put("/contas/:numeroConta/usuario", validarDados, atualizarUsuario);

rotas.delete("/contas/:numeroConta", validarSaldo, excluirConta);

rotas.post("/transacoes/depositar", validarTransacao, depositar);

rotas.post("/transacoes/sacar", validarSaque, sacar);

rotas.post("/transacoes/transferir", validarTransferencia, transferir);

rotas.get("/contas/saldo", validarContaeSenha, consultaDeSaldo);

rotas.get("/contas/extrato", validarContaeSenha, consultarExtrato);

module.exports = rotas;
