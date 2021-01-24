const express = require('express');
const produtos = express.Router();

const ctrProduto = require("../controllers/ctrProduto");

produtos.post('/create', ctrProduto.create);
produtos.get('/', ctrProduto.index);
produtos.get('/recuperarPorDescricao', ctrProduto.recuperarPorDescricao);
produtos.delete('/:codigo', ctrProduto.remove);
produtos.get('/:codigo', ctrProduto.details);

module.exports = produtos;