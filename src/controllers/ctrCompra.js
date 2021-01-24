const HttpStatus = require('http-status-codes');
const Compra = require('../models/compra');
const ItemCompra = require('../models/itemCompra');
const Fornecedor = require('../models/fornecedor');
const Produto = require('../models/produto');

class CtrCompra {
    static async create(req, res) {
        try
        {
            let compra = await Compra.getByCodigo(req.body.codigo);
            if(!compra) {                
                let fornecedor = await Fornecedor.getByCodigo(req.body.fornecedorCodigo);
                
                compra = new Compra(
                    req.body.codigo,
                    fornecedor,
                    req.body.valorTotal,
                    null
                );
                
                var codigo = await compra.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Código já cadastrado."});
        }
        catch(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Compra.getListaCompras());
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var compra = await Compra.getByCodigo(codigo);
            if(!compra)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Compra não encontrada"});
            else
            {
                await Compra.excluirItensDaCompra(compra.codigo);
                await compra.remove();
                res.status(HttpStatus.OK).send({mensagem: "Compra excluída"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const compra = await Compra.getByCodigo(req.params.codigo);
            
            if(compra)
                res.status(HttpStatus.OK).send(compra);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Compra não encontrada"})
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }

    static async relatorioComprasPorAno(req, res) {
        try {
            res.status(HttpStatus.OK).send(await Compra.relatorioComprasPorAno(req.query.ano));
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err });
        }
    }

    static async gravaItensDaCompra(req, res) {
        var itensCompra = req.body.itensCompra;
        var codigoCompra = req.query.codigoCompra;
        var lItens = [];
        for(let el of itensCompra)
            lItens.push(new ItemCompra(new Compra(codigoCompra), new Produto(el.codigo), el.quantidade));
        
        await Compra.excluirItensDaCompra(codigoCompra);
        await Compra.gravarItensDaCompra(codigoCompra, lItens);

        res.status(HttpStatus.OK).send(await Compra.getItensDaCompra(codigoCompra));
    }
    static async getItensDaCompra(req, res) {
        var codigo = req.query.codigoCompra;
        res.status(HttpStatus.OK).send(await Compra.getItensDaCompra(codigo));
    }
}

module.exports = CtrCompra;