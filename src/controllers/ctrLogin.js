const HttpStatus = require('http-status-codes');
const hash = require('object-hash');
const jwt = require('jsonwebtoken');
const { config } = require('../../config');
const Usuario = require('../models/usuario');
const { json } = require('body-parser');

class CtrLogin {
    static async login(req, res, next) {
        try {
            let usuario = await Usuario.getByLogin(req.body.login);
            
            if(!usuario) {
                res.status(HttpStatus.BAD_REQUEST).send({erro: "Usuário não encontrado."});
            }
            else {                
                if(hash(req.body.senha) !== usuario.senha)
                    res.status(HttpStatus.BAD_REQUEST).send({erro: "Senha inválida."});
                else {
                    await jwt.sign({
                        login: req.body.login
                    },
                    config.privateKey,
                    { expiresIn: '8h'}, (erro, token) => {
                        res.json({ token: token });
                    });
                }
            }
        }
        catch(err) {
            console.log(err);
            res.status(HttpStatus.BAD_REQUEST).send({erro: err.message});
        }
    }

    static async validToken(req, res) {
        try {
            jwt.verify(req.query.token, config.privateKey, (retorno) => {
                if(retorno)
                    res.send(false);
                else
                    res.send(true);
            });
        }
        catch {
            res.send(false);
        }
    }

    static async logout(req, res, next) {
        // j
    }

    static async google(req, res, next) {
        console.log('alô, você');
        console.log(req.app.get('io'));
        console.log(req.user);
        
        res.end();

        //verifico se o usuário existe. se existir, cria o token e direciona para a página inicial.
        //Se não, redireciona para a tela de cadastro.


        //Autenticação utilizando passport.
        
        // try {
        //     let usuario = await Usuario.getByLogin(req.body.lo   gin);
        //     if(!usuario)
        //         res.status(400).send({erro: "Usuário não encontrado."});
        //     else {                
        //         if(hash(req.body.senha) !== usuario.senha)
        //             res.status(400).send({erro: "Senha inválida."});
        //         else {
        //             let token = await jwt.sign({
        //                 login: req.body.login
        //             },
        //             privateKey,
        //             { expiresIn: '1h'}, (err, token) => res.json({ token: token }));
        //         }
        //     }
        //     next();
        // }
        // catch(err) {
        //     res.status(HttpStatus.BAD_REQUEST).send({erro: err.message});
        // }
    }
}

module.exports = CtrLogin;