const express = require('express');
const vendas = express.Router();

const ctrVenda = require("../src/controllers/ctrVenda");

vendas.post('/create', ctrVenda.create);
vendas.post('/itens', ctrVenda.gravaItensDaVenda);
vendas.get('/', ctrVenda.index);
vendas.get('/itens', ctrVenda.getItensDaVenda);
vendas.delete('/:codigo', ctrVenda.remove);
vendas.get('/:codigo', ctrVenda.details);

module.exports = vendas;