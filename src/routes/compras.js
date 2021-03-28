const express = require('express');
const compras = express.Router();

const ctrCompra = require("../controllers/ctrCompra");

compras.post('/create', ctrCompra.create);
compras.post('/itens', ctrCompra.gravaItensDaCompra);
compras.get('/', ctrCompra.index);
compras.get('/itens', ctrCompra.getItensDaCompra);
compras.get('/relatorioComprasPorAno', ctrCompra.relatorioComprasPorAno);
compras.get('/comprasPorFornecedor', ctrCompra.getComprasPorFornecedor);
compras.delete('/:codigo', ctrCompra.remove);
compras.get('/:codigo', ctrCompra.details);

module.exports = compras;