const HttpStatus = require('http-status-codes');
const Usuario = require('../models/usuario');
const Cidade = require('../models/cidade');

class CtrUsuario {
    
    static async create(req, res) {
        try
        {
            let usuario = await Usuario.getByLogin(req.body.login);
            const cidade = await Cidade.getByCodigo(req.body.codigoCidade);
            console.log(cidade);
            if(!usuario) {
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
                    hash(req.body.senha) //compara hash na hora do login
                );

                var codigo = await usuario.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else {
                usuario.nome = req.body.nome;
                usuario.cidade = cidade;
                usuario.logradouro = req.body.logradouro;
                usuario.bairro = req.body.bairro;
                usuario.numero = req.body.numero;
                usuario.cep = req.body.cep;
                usuario.email = req.body.email;
                usuario.cpf = req.body.cpf;
                if(req.body.senha)
                    usuario.senha = hash(req.body.senha);
                
                await usuario.save();
                res.status(HttpStatus.OK).send({codigo: usuario.codigo});
            }
        }
        catch(err) {
            console.log(err)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err.message});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Usuario.getListaUsuarios());
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var usuario = await Usuario.getByCodigo(codigo);
            if(!usuario)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Usuário não encontrado"});
            else
            {
                await usuario.remove();
                res.status(HttpStatus.OK).send({mensagem: "Usuário excluído"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err.message});
        }
    }
    static async details(req, res) {
        try {
            const usuario = await Usuario.getByCodigo(req.params.codigo);
            if(usuario)
                res.status(HttpStatus.OK).send(usuario);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Usuário não encontrado"});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err.message});
        }
    }
}

module.exports = CtrUsuario;