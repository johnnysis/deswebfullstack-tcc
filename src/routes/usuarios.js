const express = require('express');
const usuarios = express.Router();

const ctrUsuario = require("../controllers/ctrUsuario");

usuarios.post('/register', ctrUsuario.create);
usuarios.get('/', ctrUsuario.index);
usuarios.delete('/:codigo', ctrUsuario.remove);
usuarios.get('/:codigo', ctrUsuario.details);

module.exports = usuarios;