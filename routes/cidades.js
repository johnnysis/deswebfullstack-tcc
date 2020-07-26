const express = require('express');
const cidades = express.Router();
const ctrCidades = require('../src/controllers/ctrCidade');

cidades.get('/', ctrCidades.get);

module.exports = cidades;