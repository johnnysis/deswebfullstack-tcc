const express = require('express');
const clientes = express.Router();

const ctrCliente = require("../controllers/ctrCliente");

clientes.post('/create', ctrCliente.create);
clientes.post('/telefones', ctrCliente.gravaTelefones);
clientes.get('/telefones', ctrCliente.getTelefones);
clientes.get('/', ctrCliente.index);
clientes.get('/recuperarPorNomeCpf', ctrCliente.recuperarPorNomeCpf);
clientes.delete('/:codigo', ctrCliente.remove);
clientes.get('/:codigo', ctrCliente.details);

module.exports = clientes;