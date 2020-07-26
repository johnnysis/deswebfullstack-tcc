const express = require('express');
const estados = express.Router();
const ctrEstados = require('../src/controllers/ctrEstado');

estados.get('/', ctrEstados.get);
module.exports = estados;