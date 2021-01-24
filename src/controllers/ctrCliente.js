const HttpStatus = require('http-status-codes');
const Cliente = require('../models/cliente');
const Cidade = require('../models/cidade');
const Telefone = require('../models/telefone');

class CtrCliente {
    static async create(req, res) {
        try
        {
            let cliente = await Cliente.getByCpf(req.body.cpf);
            const cidade = await Cidade.getByCodigo(req.body.codigoCidade);
            if(!cliente) {
                cliente = new Cliente(
                    req.body.codigo,
                    req.body.nome,
                    cidade,
                    req.body.logradouro,
                    req.body.bairro,
                    req.body.numero,
                    req.body.cep,
                    req.body.email,
                    req.body.cpf
                );

                var codigo = await cliente.save();
                res.status(HttpStatus.OK).send({codigo});
            }
            else {
                cliente.nome = req.body.nome;
                cliente.cidade = cidade;
                cliente.logradouro = req.body.logradouro;
                cliente.bairro = req.body.bairro;
                cliente.numero = req.body.numero;
                cliente.cep = req.body.cep;
                cliente.email = req.body.email;
                cliente.cpf = req.body.cpf;
                
                await cliente.save();
                res.status(HttpStatus.OK).send({codigo: cliente.codigo});
            }
        }
        catch(err) {
            console.log(err.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err.message});
        }
    }
    static async index(req, res, next) {
        res.status(HttpStatus.OK).send(await Cliente.getlistaClientes());
    }

    static async recuperarPorNomeCpf(req, res, next) {
        try {
            let clisPorCpf = await Cliente.getListByCpf(req.query.nomeCpf);
            let clisPorNome = await Cliente.getListByNome(req.query.nomeCpf);

            let retorno = clisPorCpf && clisPorCpf.length > 0 ? clisPorCpf : clisPorNome;

            res.status(HttpStatus.OK).send(retorno);
        }
        catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ erro: err.message });
        }
    }

    static async gravaTelefones(req, res, next) {
        var listaTelefones = req.body.listaTelefones;
        var codigo = req.query.codigoCliente;
        var lTel = [];
        for(let el of listaTelefones)
            lTel.push(new Telefone(0, el.numero, new Cliente(codigo)));

        res.status(HttpStatus.OK).send(await Cliente.salvarTelefones(codigo, lTel));
    }
    static async getTelefones(req, res, next) {
        var codigo = req.query.pes_codigo;
        
        res.status(HttpStatus.OK).send(await Telefone.getListaTelefonesPorCliente(codigo));
    }
    static async remove(req, res) {
        try {
            const codigo = req.params.codigo;
            var cliente = await Cliente.getByCodigo(codigo);
            if(!cliente)
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Cliente não encontrado"});
            else
            {
                await cliente.remove();
                res.status(HttpStatus.OK).send({mensagem: "Cliente excluído"});
            }
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
    static async details(req, res) {
        try {
            const cliente = await Cliente.getByCodigo(req.params.codigo);
            if(cliente)
                res.status(HttpStatus.OK).send(cliente);
            else
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: "Cliente não encontrado"})
        }
        catch(err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({erro: err});
        }
    }
}

module.exports = CtrCliente;