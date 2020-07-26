const HttpStatus = require('http-status-codes');
const Fornecedor = require('../models/fornecedor');
const Cidade = require('../models/cidade');

class CtrFornecedor {
    static async create(req, res) {
        try
        {
            let fornecedor = await Fornecedor.getByCnpj(req.body.cnpj);
            
            
            if(!fornecedor) {
                const cidade = await Cidade.getByCodigo(req.body.codigocidade);
                
                fornecedor = new Fornecedor(
                    req.body.codigo,
                    req.body.nome,
                    cidade,
                    req.body.logradouro,
                    req.body.bairro,
                    req.body.numero,
                    req.body.cep,
                    req.body.email,
                    req.body.cnpj,
                    req.body.razaosocial,
                    req.body.nomefantasia
                );

                var codigo = await fornecedor.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Cnpj já cadastrado."});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Fornecedor.getListaFornecedores());
    }
    static async remove(req, res) {
        try {
            const cnpj = req.params.cnpj;
            var fornecedor = await Fornecedor.getByCnpj(cnpj);
            if(!fornecedor)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Fornecedor não encontrado"});
            else
            {
                await fornecedor.remove();
                res.status(HttpStatus.OK).send({mensagem: "Fornecedor excluído"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const fornecedor = await Fornecedor.getByCnpj(req.params.cnpj);
            if(fornecedor)
                res.status(HttpStatus.OK).send(fornecedor);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Fornecedor não encontrado"});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
}

module.exports = CtrFornecedor;