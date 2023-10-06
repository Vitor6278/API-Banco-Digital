const validarEmail = require('email-validator');
const bancoDeDados = require('./bancodedados');

//Remove espaços e pontuações de um cpf.
const limparCPF = (cpf) => {
  return cpf.replace(/\D/g, '');
}

const validarSenha = (req, res, next) => {
  const senhaInformada = req.query.senha_banco;

  if (!senhaInformada) {
    return res.status(400).json({ mensagem: 'A senha do banco deve ser informada!' });
  }

  if (senhaInformada !== bancoDeDados.banco.senha) {
    return res.status(401).json({ mensagem: 'A senha do banco informada é inválida!' });
  }

  next();
};

const validarDadosObrigatorios = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os dados são obrigatórios.' })
  }
  
  if (!validarEmail.validate(email)) {
    return res.status(400).json({ mensagem: 'O email informado é inválido!' })
  }

  const cpfLimpo = limparCPF(cpf);

  if (cpfLimpo.length !== 11) {
    return res.status(400).json({ mensagem: 'O CPF informado é inválido!' });
  }

  const cpfExistente = bancoDeDados.contas.find(
    (conta) => limparCPF(conta.cpf) === cpfLimpo
  );

  const emailExistente = bancoDeDados.contas.find(
    (conta) => conta.email === email
  );

  if (emailExistente || cpfExistente) {
    return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' });
  }
  
  next();
}
  
const validarDados = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email,  senha } = req.body;
  const numeroConta = Number(req.params.numeroConta);
  const conta = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);

  if (isNaN(numeroConta)) {
    return res.status(400).json({ mensagem: 'Número de conta inválido!' });
  }

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta não encontrada.' });
 
  }

  if (!nome || !data_nascimento || !telefone || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
  }

  if (cpf) {
    const cpfLimpo = limparCPF(cpf);
  
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({ mensagem: 'O CPF informado é inválido!' });
    }
  
    const cpfExistente = bancoDeDados.contas.find(
      (conta) => limparCPF(conta.cpf) === cpfLimpo
    );
  
    if (cpfExistente) {
      return res.status(400).json({ mensagem: 'Já existe uma conta com o CPF informado!' });
    }
  }
  
  if (email) {
    if (!validarEmail.validate(email)) {
      return res.status(400).json({ mensagem: 'O email informado é inválido!' });
    }
  
    const emailExistente = bancoDeDados.contas.find(
      (conta) => conta.email === email
    );
  
    if (emailExistente) {
      return res.status(400).json({ mensagem: 'Já existe uma conta com o e-mail informado!' });
    }
  }
  
  next();
};

const validarSaldo = (req, res, next) => {
  const numeroConta = Number(req.params.numeroConta);
  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === numeroConta
  );

  if (isNaN(numeroConta)) {
    return res.status(400).json({ mensagem: 'Numero da conta inválida!' });
  } else if (!conta) {
    return res.status(400).json({ mensagem: 'Conta não encontrada!' });
  } else if (conta.saldo !== 0) {
    return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
  }

  next();
}

const validarTransacao = (req, res, next) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor) {
    return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
  }
   
  const valorFormatado = parseInt(valor);

  if (isNaN(valorFormatado) || valorFormatado <= 0) {
  return res.status(400).json({ mensagem: 'O valor do depósito deve ser um número válido e positivo!' });
}

  const conta = bancoDeDados.contas.find(
    (conta) => conta.numero === Number(numero_conta)
  ); 
   
  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta não encontrada!' }); 
}
  next();
}; 

const validarSaque = (req, res, next) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || !valor || !senha) {
    return res.status(400).json({ mensagem: 'Todos os dados são obrigatórios' });
  }

  const valorNumerico = Number(valor);

  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({ mensagem: 'O valor do saque deve ser um número válido e positivo' });
  }

  const conta = bancoDeDados.contas.find((conta) => conta.numero === Number(numero_conta));

  if (!conta) {
    return res.status(404).json({ mensagem: 'A conta não existe' });
  } else if (senha !== conta.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta' });
  } else if (valorNumerico > conta.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente para realizar o saque' });
  } 
  next();
};

const validarTransferencia = (req, res, next) => {
 const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
 
 if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
  return res.status(400).json({ mensagem: 'Todos os dados sao obrigatorios!' });
 }
 
 const valorNumerico = Number(valor);
 
 if (isNaN(valorNumerico) || valorNumerico <= 0) {
  return res.status(400).json({ mensagem: 'O valor do saque deve ser um número válido e positivo.' })
}

const contaOrigem = bancoDeDados.contas.find(
  (conta) => conta.numero === Number(numero_conta_origem)
 );

 const contaDestino = bancoDeDados.contas.find(
  (conta) => conta.numero === Number(numero_conta_destino)
 );
  
 if (!contaOrigem || !contaDestino) {
  return res.status(404).json({ mensagem: 'Conta nao encontrada.' });
 } else if (valorNumerico > contaOrigem.saldo) {
  return res.status(400).json({ mensagem: 'Saldo insuficiente!' })
} else if (senha!== contaOrigem.senha) {
  return res.status(401).json({ mensagem: 'Senha incorreta' });
 } 
 next();
}

const validarContaeSenha = (req, res, next) => {
  const { numero_conta, senha } = req.query;
 
 if (!numero_conta || !senha) {
  return res.status(400).json({ mensagem: 'Dados invalidos.' })
 }
 
 const conta = bancoDeDados.contas.find(
  (conta) => conta.numero === Number(numero_conta)
 );

 if (!conta) {
  return res.status(400).json({ mensagem: 'Conta bancária não encontada!' })
 } else if (senha !== conta.senha) {
  return res.status(401).json({ mensagem: 'Senha incorreta.' })
 }
 next();
}

module.exports = {
  limparCPF,
  validarDados,
  validarSenha,
  validarDadosObrigatorios,
  validarSaldo,
  validarTransacao,
  validarSaque,
  validarTransferencia,
  validarContaeSenha
};