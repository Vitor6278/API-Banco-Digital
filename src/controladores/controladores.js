const bancoDeDados = require("../bancodedados");
const validarCPF = require("node-cpf");
const { limparCPF } = require("../intermediarios");

const listarContas = (req, res) => {
  return res.json(bancoDeDados.contas);
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const cpfFormatado = limparCPF(cpf);

  const contaNova = {
    numero: bancoDeDados.contas.length + 1,
    saldo: 0,
    nome,
    cpf: validarCPF.mask(cpfFormatado),
    data_nascimento,
    telefone,
    email,
    senha,
  };

  bancoDeDados.contas.push(contaNova);
  return res.status(201).json();
};

const atualizarUsuario = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const cpfFormatado = limparCPF(cpf);

  const usuario = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(req.params.numeroConta)
  );

  usuario.nome = nome;
  usuario.cpf = validarCPF.mask(cpfFormatado);
  usuario.data_nascimento = data_nascimento;
  usuario.telefone = telefone;
  usuario.email = email;
  usuario.senha = senha;

  return res.status(204).json();
};

const excluirConta = (req, res) => {
  const numeroConta = Number(req.params.numeroConta);
  const contaIndex = bancoDeDados.contas.findIndex(
    (conta) => conta.numero === numeroConta
  );

  // Função para remover transações com base no número da conta.
  const removerTransacoesPorNumeroConta = (transacoes, numeroConta) => {
    if (Array.isArray(transacoes)) {
      return transacoes.filter((transacao) => {
        return (
          transacao.numero_conta_origem !== numeroConta &&
          transacao.numero_conta_destino !== numeroConta &&
          transacao.numero_conta !== numeroConta
        );
      });
    } else {
      return [];
    }
  };
  
  // Remove quaisquer dados sobre a conta excluída.
  bancoDeDados.contas.splice(contaIndex, 1);
  bancoDeDados.saques = removerTransacoesPorNumeroConta(bancoDeDados.saques, numeroConta);
  bancoDeDados.depositos = removerTransacoesPorNumeroConta(bancoDeDados.depositos, numeroConta);
  bancoDeDados.transferencias = removerTransacoesPorNumeroConta(bancoDeDados.transferencias, numeroConta);
  bancoDeDados.transferenciasRecebidas = removerTransacoesPorNumeroConta(bancoDeDados.transferenciasRecebidas, numeroConta);

  // Reindexamento de conta.
  for (let i = 0; i < bancoDeDados.contas.length; i++) {
    bancoDeDados.contas[i].numero = i + 1;
  }

  return res.status(204).send();
};

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );

  const valorFormatado = Number(valor);

  conta.saldo += valorFormatado;

  bancoDeDados.depositos.push({
    data: new Date(Date.now()),
    numero_conta: Number(numero_conta),
    valor: valorFormatado,
  });

  res.status(200).json();
};

const sacar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  );

  conta.saldo -= Number(valor);

  bancoDeDados.saques.push({
    data: new Date(Date.now()),
    numero_conta: Number(numero_conta),
    valor: Number(valor),
  });

  return res.status(200).json();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor } = req.body;

  const origem = Number(numero_conta_origem);
  const destino = Number(numero_conta_destino);
  const valorTransferencia = Number(valor);

  const contaOrigem = bancoDeDados.contas.find(
    (conta) => conta.numero === origem
  );

  const contaDestino = bancoDeDados.contas.find(
    (conta) => conta.numero === destino
  );

  contaOrigem.saldo -= valorTransferencia;
  contaDestino.saldo += valorTransferencia;

  bancoDeDados.transferencias.push({
    data: new Date(Date.now()),
    numero_conta_origem: origem,
    numero_conta_destino: destino,
    valor: valorTransferencia,
  });

  return res.status(200).json();
};

const consultaDeSaldo = (req, res) => {
  const numero_conta = Number(req.query.numero_conta);

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numero_conta
  );

  return res.status(200).json({ saldo: conta.saldo });
};

const consultarExtrato = (req, res) => {
  const conta = Number(req.query.numero_conta);

  const extrato = {
    depositos: bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === conta),
    saques: bancoDeDados.saques.filter((saque) => saque.numero_conta === conta),
    transferenciasEnviadas: bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_origem === conta),
    transferenciasRecebidas: bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_destino === conta)
  };

  return res.status(200).json(extrato);
};

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  depositar,
  sacar,
  transferir,
  consultaDeSaldo,
  consultarExtrato,
};
