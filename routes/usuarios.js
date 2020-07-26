const express = require('express');
const usuarios = express.Router();

const ctrUsuario = require("../src/controllers/ctrUsuario");

usuarios.post('/register', ctrUsuario.create);
usuarios.get('/', ctrUsuario.index);
usuarios.delete('/:login', ctrUsuario.remove);
usuarios.get('/:login', ctrUsuario.details);

module.exports = usuarios;