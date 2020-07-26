const express = require('express');
const clientes = express.Router();

const ctrCliente = require("../src/controllers/ctrCliente");

clientes.post('/create', ctrCliente.create);
clientes.post('/telefones', ctrCliente.gravaTelefones);
clientes.get('/telefones', ctrCliente.getTelefones);
clientes.get('/', ctrCliente.index);
clientes.delete('/:cpf', ctrCliente.remove);
clientes.get('/:cpf', ctrCliente.details);

module.exports = clientes;