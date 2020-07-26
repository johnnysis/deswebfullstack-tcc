const HttpStatus = require('http-status-codes');
const Produto = require('../models/produto');
const Categoria = require('../models/categoria');

class CtrProduto {
    static async create(req, res) {
        try
        {
            let produto = await Produto.getByCodigo(req.body.codigo);
            console.log(produto);
            
            if(!produto) {
                const categoria = await Categoria.getByCodigo(req.body.codigocategoria);
                
                produto = new Produto(
                    req.body.codigo,
                    req.body.descricao,
                    categoria,
                    req.body.quantidade,
                    req.body.preco
                );

                var codigo = await produto.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Código já cadastrado."});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Produto.getListaProdutos());
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var produto = await Produto.getByCodigo(codigo);
            if(!produto)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Produto não encontrado"});
            else
            {
                await produto.remove();
                res.status(HttpStatus.OK).send({mensagem: "Produto excluído"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const produto = await Produto.getByCodigo(req.params.codigo);
            if(produto)
                res.status(HttpStatus.OK).send(produto);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Produto não encontrado"});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
}

module.exports = CtrProduto;