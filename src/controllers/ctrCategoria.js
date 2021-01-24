const HttpStatus = require('http-status-codes');
const Categoria = require('../models/categoria');

class CtrCategoria {
    static async create(req, res) {
        
        try
        {
            let categoria = await Categoria.getByCodigo(req.body.codigo);
            if(!categoria) {

                categoria = new Categoria(
                    req.body.codigo,
                    req.body.descricao,
                );

                var codigo = await categoria.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else {
                
                categoria.descricao = req.body.descricao;
                await categoria.save()
                res.status(HttpStatus.OK).send({codigo});
            }
        }
        catch(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        try {
            res.status(HttpStatus.OK).send(await Categoria.getListaCategorias());
        }
        catch(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var categoria = await Categoria.getByCodigo(codigo);
            
            if(!categoria)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Categoria não encontrada"});
            else
            {
                await categoria.remove();
                res.status(HttpStatus.OK).send({mensagem: "Categoria excluída"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const categoria = await Categoria.getByCodigo(req.params.codigo);
            if(categoria)
                res.status(HttpStatus.OK).send(categoria);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Categoria não encontrada"})
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
}

module.exports = CtrCategoria;  