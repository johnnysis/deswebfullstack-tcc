const express = require('express');
const fornecedores = express.Router();

const ctrFornecedor = require("../controllers/ctrFornecedor");

fornecedores.post('/create', ctrFornecedor.create);
fornecedores.get('/', ctrFornecedor.index);
fornecedores.delete('/:codigo', ctrFornecedor.remove);
fornecedores.get('/recuperarPorNomeFantasiaCnpj', ctrFornecedor.recuperarPorNomeFantasiaCnpj);
fornecedores.get('/:codigo', ctrFornecedor.details);

module.exports = fornecedores;