const express = require('express');
const formasPagamento = express.Router();

const ctrFormasPagamento = require("../src/controllers/ctrFormaPagamento");

formasPagamento.post('/create', ctrFormasPagamento.create);
formasPagamento.get('/', ctrFormasPagamento.index);
formasPagamento.delete('/:codigo', ctrFormasPagamento.remove);
formasPagamento.get('/:codigo', ctrFormasPagamento.details);

module.exports = formasPagamento;