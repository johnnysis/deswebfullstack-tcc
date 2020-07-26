const express = require('express');
const categorias = express.Router();

const ctrCategoria = require("../src/controllers/ctrCategoria");

categorias.post('/create', ctrCategoria.create);
categorias.get('/', ctrCategoria.index);
categorias.delete('/:codigo', ctrCategoria.remove);
categorias.get('/:codigo', ctrCategoria.details);

module.exports = categorias;