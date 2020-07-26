const HttpStatus = require('http-status-codes');
const Usuario = require('../models/usuario');
const Cidade = require('../models/cidade');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const salt = 12;

class CtrUsuario {
    static async create(req, res) {
        try
        {
            let usuario = await Usuario.getByLogin(req.body.login);
            
            if(!usuario) {
                const cidade = await Cidade.getByCodigo(req.body.codigocidade);

                usuario = new Usuario(
                    req.body.codigo,
                    req.body.nome,
                    cidade,
                    req.body.logradouro,
                    req.body.bairro,
                    req.body.numero,
                    req.body.cep,
                    req.body.email,
                    req.body.login,
                    bcrypt.hashSync(req.body.senha, salt) //compara hash na hora do login
                );

                var codigo = await usuario.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "login encontra-se em uso."});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Usuario.getListaUsuarios());
    }
    static async remove(req, res) {
        try {
            const login = req.params.login;
            var usuario = await Usuario.getByLogin(login);
            if(!usuario)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Usuário não encontrado"});
            else
            {
                await usuario.remove();
                res.status(HttpStatus.OK).send({mensagem: "Usuário excluído"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const usuario = await Usuario.getByLogin(req.params.login);
            if(usuario)
                res.status(HttpStatus.OK).send(usuario);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Usuário não encontrado"});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }

}

module.exports = CtrUsuario;