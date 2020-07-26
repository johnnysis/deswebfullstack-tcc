const express = require('express');
const compras = express.Router();

const ctrCompra = require("../src/controllers/ctrCompra");

compras.post('/create', ctrCompra.create);
compras.post('/itens', ctrCompra.gravaItensDaCompra);
compras.get('/', ctrCompra.index);
compras.get('/itens', ctrCompra.getItensDaCompra);
compras.delete('/:codigo', ctrCompra.remove);
compras.get('/:codigo', ctrCompra.details);

module.exports = compras;