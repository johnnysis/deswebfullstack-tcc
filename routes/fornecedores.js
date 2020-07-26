const express = require('express');
const fornecedores = express.Router();

const ctrFornecedor = require("../src/controllers/ctrFornecedor");

fornecedores.post('/create', ctrFornecedor.create);
fornecedores.get('/', ctrFornecedor.index);
fornecedores.delete('/:cnpj', ctrFornecedor.remove);
fornecedores.get('/:cnpj', ctrFornecedor.details);

module.exports = fornecedores;