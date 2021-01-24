const HttpStatus = require('http-status-codes');
const Produto = require('../models/produto');
const Categoria = require('../models/categoria');

class CtrProduto {
    static async create(req, res) {
        try
        {
            let produto = await Produto.getByCodigo(req.body.codigo);
            const categoria = await Categoria.getByCodigo(req.body.codigoCategoria);
            
            if(!produto) {
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
            else {
                produto.descricao = req.body.descricao;
                produto.categoria = categoria;
                produto.quantidade = req.body.quantidade;
                produto.preco = req.body.preco;
                
                await produto.save()
                res.status(HttpStatus.OK).send({codigo});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err.toString()});
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
    static async recuperarPorDescricao(req, res) {
        try {
            const produtos = await Produto.getListByDescricao(req.query.descricao);
            res.status(HttpStatus.OK).send(produtos);
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err });
        }
    }
}

module.exports = CtrProduto;