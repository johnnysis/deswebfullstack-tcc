const express = require('express');
const vendas = express.Router();

const ctrVenda = require("../controllers/ctrVenda");

vendas.post('/create', ctrVenda.create);
vendas.post('/itens', ctrVenda.gravaItensDaVenda);
vendas.get('/', ctrVenda.index);
vendas.get('/itens', ctrVenda.getItensDaVenda);
vendas.get('/vendasPorCliente', ctrVenda.getVendasPorCliente);
vendas.post('/realizarPagamento', ctrVenda.realizarPagamento);
vendas.get('/relatorioVendasPorAno', ctrVenda.relatorioVendasPorAno);
vendas.get('/relatorioVendasPorCategoria', ctrVenda.relatorioVendasPorCategoria);
vendas.get('/relatorioVendasPorFormaDePagamento', ctrVenda.relatorioVendasPorFormaDePagamento);
vendas.get('/relatorioPagosNaoPagosPorMesAno', ctrVenda.relatorioPagosNaoPagosPorMesAno);

//vendas.delete('/:codigo', ctrVenda.remove);

//vendas.get('/:codigo', ctrVenda.details);
module.exports = vendas;