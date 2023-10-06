const express = require('express');
const rotas = require('./rotas');

const app = express();

app.use(express.json());

app.use(rotas);

// Middleware para tratamento de erro 500 (internal server error) caso ocorra algum problema inesperado ou bug.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Middleware para tratamento de erro 404 (não encontrado) caso os middlewares independentes falhem em alguma validação.
app.use((req, res, next) => {
    res.status(404).json({ error: 'Recurso não encontrado' });
});

app.listen(3000);