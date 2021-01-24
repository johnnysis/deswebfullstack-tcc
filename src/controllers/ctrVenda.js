const HttpStatus = require('http-status-codes');
const Venda = require('../models/venda');
const ItemVenda = require('../models/itemVenda');
const Cliente = require('../models/cliente');
const FormaPagamento = require('../models/formaPagamento');
const Produto = require('../models/produto');


class CtrVenda {
    static async create(req, res) {
        try
        {
            let venda = await Venda.getByCodigo(req.body.codigo);
            
            if (!venda) {
                let formaPagamento = null;
                if (req.body.formaPagamento)
                    formaPagamento = await FormaPagamento.getByCodigo(req.body.formaPagamentoCodigo);
                
                let cliente = await Cliente.getByCodigo(req.body.clienteCodigo);

                venda = new Venda(
                    req.body.codigo,
                    cliente,
                    formaPagamento,
                    req.body.valorTotal,
                    req.body.valorTotalComDesconto,
                    req.body.pago,
                    null,
                    null
                );
                
                var codigo = await venda.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Código já cadastrado."});
        }
        catch (err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Venda.getListaVendas());
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var venda = await Venda.getByCodigo(codigo);
            if(!venda)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Venda não encontrada"});
            else
            {
                await Venda.excluirItensDaVenda(venda.codigo);
                await venda.remove();
                res.status(HttpStatus.OK).send({mensagem: "Venda excluída"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const venda = await Venda.getByCodigo(req.params.codigo);
            
            if(venda)
                res.status(HttpStatus.OK).send(venda);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Venda não encontrada"})
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }

    static async gravaItensDaVenda(req, res) {
        try {
            var itensVenda = req.body.itensVenda;
            var codigoVenda = req.query.codigoVenda;
            var lItens = [];
            for (let el of itensVenda)
                lItens.push(new ItemVenda(new Venda(codigoVenda), new Produto(el.codigo), el.quantidade));

            await Venda.excluirItensDaVenda(codigoVenda);
            await Venda.gravarItensDaVenda(codigoVenda, lItens);

            res.status(HttpStatus.OK).send(await Venda.getItensDaVenda(codigoVenda));
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err.message });
        }
    }

    static async getVendasPorCliente(req, res) {
        try {
            let clienteCodigo = req.query.clienteCodigo;

            res.status(HttpStatus.OK).send(await Venda.getVendasPorCliente(clienteCodigo));
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err.message });
        }
    }

    static async getItensDaVenda(req, res) {
        var codigo = req.query.codigoVenda;
        res.status(HttpStatus.OK).send(await Venda.getItensDaVenda(codigo));
    }

    static async realizarPagamento(req, res) {
        try {
            let venda = await Venda.getByCodigo(req.body.codigoVenda);
            let formaPagamento = await FormaPagamento.getByCodigo(req.body.codigoFormaPagamento);

            if (formaPagamento === null)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: "Forma de pagamento não localizada." });
            else {
                venda.formaPagamento = formaPagamento;
                venda.save();
                res.status(HttpStatus.OK).send({ codigo: venda.codigo });
            }
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err.message });
        }
    }

    static async relatorioVendasPorAno(req, res) {
        try {
            res.status(HttpStatus.OK).send(await Venda.relatorioVendasPorAno(req.query.ano));
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err });
        }
    }
    static async relatorioVendasPorCategoria(req, res) {
        try {
            res.status(HttpStatus.OK).send(await Venda.relatorioVendasPorCategoria());
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err });
        }
    }
    static async relatorioVendasPorFormaDePagamento(req, res) {
        try {
            res.status(HttpStatus.OK).send(await Venda.relatorioVendasPorFormaDePagamento());
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err });
        }
    }
    static async relatorioPagosNaoPagosPorMesAno(req, res) {
        try {
            res.status(HttpStatus.OK).send(await Venda.relatorioPagosNaoPagosPorMesAno(req.query.ano));
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err });
        }
    }
}

module.exports = CtrVenda;