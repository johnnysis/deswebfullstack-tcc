const HttpStatus = require('http-status-codes');
const FormaPagamento = require('../models/formaPagamento');

class CtrFormaPagamento {
    static async create(req, res) {
        try
        {
            let formaPagamento = await FormaPagamento.getByCodigo(req.body.codigo);
            
            if(!formaPagamento) {

                formaPagamento = new FormaPagamento(
                    req.body.codigo,
                    req.body.descricao,
                );

                var codigo = await formaPagamento.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else {
                
                formaPagamento.descricao = req.body.descricao;
                await formaPagamento.save()
                res.status(HttpStatus.OK).send({codigo});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await FormaPagamento.getListaFormasPagamento());
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var formaPagamento = await FormaPagamento.getByCodigo(codigo);
            if(!formaPagamento)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Forma de Pagamento não encontrada"});
            else
            {
                await formaPagamento.remove();
                res.status(HttpStatus.OK).send({mensagem: "Forma de pagamento excluída"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const formaPagamento = await FormaPagamento.getByCodigo(req.params.codigo);
            if(formaPagamento)
                res.status(HttpStatus.OK).send(formaPagamento);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Forma de pagamento não encontrada"})
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
}

module.exports = CtrFormaPagamento;