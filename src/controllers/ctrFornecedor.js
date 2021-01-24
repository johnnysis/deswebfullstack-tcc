const HttpStatus = require('http-status-codes');
const Fornecedor = require('../models/fornecedor');
const Cidade = require('../models/cidade');

class CtrFornecedor {
    static async create(req, res) {
        try
        {
            let fornecedor = await Fornecedor.getByCodigo(req.body.codigo);
            const cidade = await Cidade.getByCodigo(req.body.codigoCidade);
            if(!fornecedor) {
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
                    req.body.razaoSocial
                );

                var codigo = await fornecedor.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else {
                
                fornecedor.nome = req.body.nome,
                fornecedor.cidade = cidade,
                fornecedor.logradouro = req.body.logradouro,
                fornecedor.bairro = req.body.bairro,
                fornecedor.numero = req.body.numero,
                fornecedor.cep = req.body.cep,
                fornecedor.email = req.body.email,
                fornecedor.cnpj = req.body.cnpj,
                fornecedor.razaoSocial = req.body.razaoSocial
                await fornecedor.save();
                res.status(HttpStatus.OK).send({codigo: fornecedor.codigo});
            }
        }
        catch(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Fornecedor.getListaFornecedores());
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var fornecedor = await Fornecedor.getByCodigo(codigo);
            if(!fornecedor)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Fornecedor não encontrado"});
            else
            {
                await fornecedor.remove();
                res.status(HttpStatus.OK).send({mensagem: "Fornecedor excluído"});
            }
        }
        catch(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const fornecedor = await Fornecedor.getByCodigo(req.params.codigo);
            if(fornecedor)
                res.status(HttpStatus.OK).send(fornecedor);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Fornecedor não encontrado"});
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async recuperarPorNomeFantasiaCnpj(req, res) {
        try {
            let forsPorCnpj = await Fornecedor.getListByCnpj(req.query.nomeFantasiaCnpj);
            let forsPorNomeFantasia = await Fornecedor.getListByNomeFantasia(req.query.nomeFantasiaCnpj);

            let retorno = forsPorCnpj && forsPorCnpj.length > 0 ? forsPorCnpj : forsPorNomeFantasia;

            res.status(HttpStatus.OK).send(retorno);
        }
        catch (err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err.message });
        }
    }
}

module.exports = CtrFornecedor;