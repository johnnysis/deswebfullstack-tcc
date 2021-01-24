const express = require('express');
const cidades = express.Router();
const ctrCidade = require('../controllers/ctrCidade');

cidades.get('/', ctrCidade.get);

module.exports = cidades;