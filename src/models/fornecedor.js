const db = require('../database/db.js');
const Pessoa = require('./pessoa');
const Cidade = require('./cidade');

class Conversao {
    static async converteFornecedor(result) {
        let cidade = await Cidade.getByCodigo(result.cid_codigo);
        
        let fornecedor = new Fornecedor(
            result.pes_codigo,
            result.pes_nome,
            cidade,
            result.pes_logradouro,
            result.pes_bairro,
            result.pes_numero,
            result.pes_cep,
            result.pes_email,
            result.for_cnpj,
            result.for_razaosocial,
            result.for_nomefantasia);
        return fornecedor;
    }
}

class Fornecedor extends Pessoa {
    constructor(codigo, nome, cidade, logradouro, bairro, numero, cep, email, cnpj, razaoSocial, nomeFantasia) {
        super(codigo, nome, cidade, logradouro, bairro, numero, cep, email);
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.nomeFantasia = nomeFantasia;
    }
    async save() {
        let params = [];
        let sql = ``;
        if(this.codigo === 0) {
            let insertedCodigo = await super.save();
            params = [insertedCodigo, this.cnpj, this.razaoSocial, this.nomeFantasia];
            sql = `insert into fornecedor(pes_codigo, for_cnpj, for_razaosocial, for_nomefantasia)
                    values(?, ?, ?, ?)`;
        }
        else {
            super.save();
            sql = `update fornecedor set for_cnpj = ?, for_razaosocial = ?
                        where pes_codigo = ?`;
            params = [this.cnpj, this.razaoSocial, this.codigo];
        }
        
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(() => resolve(this.codigo))
                .catch(err => reject(err));
        });
    }
    static getListaFornecedores() {
        var sql = 'select * from fornecedor f inner join pessoa p on f.pes_codigo = p.pes_codigo';

        return new Promise((resolve, reject) => {
            db.select(sql)
            .then(async function(rLista) {
                let listaFornecedores = [];
                for (const el of rLista) {
                    let cidade = await Cidade.getByCodigo(el.cid_codigo);
                    
                    listaFornecedores.push(new Fornecedor(
                        el.pes_codigo,
                        el.pes_nome,
                        cidade,
                        el.pes_logradouro,
                        el.pes_bairro,
                        el.pes_numero,
                        el.pes_cep,
                        el.pes_email,
                        el.for_cnpj,
                        el.for_razaosocial,
                        el.for_nomefantasia));
                }
                resolve(listaFornecedores);
            })
            .catch(reason => reject(reason));
        });
    }

    remove() {
        const sql = "delete from fornecedor where for_cnpj = ?";
        const params = [this.cnpj];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => {
                super.remove();
                resolve(numberRows);
            })
            .catch(err => reject(err));
        });
    }

    static getByCnpj(cnpj) {
        const sql = 'select * from fornecedor f inner join pessoa p on f.pes_codigo = p.pes_codigo where f.for_cnpj = ?';
        const params = [cnpj];
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result.length > 0)
                {
                    let fornecedor = await Conversao.converteFornecedor(result[0]);
                    resolve(fornecedor);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }

    static getListByCnpj(cnpj) {
        const sql = "select * from fornecedor f inner join pessoa p on f.pes_codigo = p.pes_codigo where f.for_cnpj like ?";
        const params = [`%${cnpj}%`];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(async function (result) {
                    var fornecedores = [];
                    if (result && result.length > 0) {
                        for (let el of result) {
                            let fornecedor = await Conversao.converteFornecedor(el);
                            fornecedores.push(fornecedor);
                        }

                        resolve(fornecedores);
                    }
                    else
                        resolve(null);
                })
                .catch(err => reject(err));
        });
    }

    static getListByNomeFantasia(nomeFantasia) {
        const sql = "select * from fornecedor f inner join pessoa p on f.pes_codigo = p.pes_codigo where f.for_nomefantasia like ?";
        const params = [`%${nomeFantasia}%`];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(async function (result) {
                    var fornecedores = [];
                    if (result && result.length > 0) {
                        for (let el of result) {
                            let fornecedor = await Conversao.converteFornecedor(el);
                            fornecedores.push(fornecedor);
                        }

                        resolve(fornecedores);
                    }
                    else
                        resolve(null);
                })
                .catch(err => reject(err));
        });
    }

    static getByCodigo(codigo) {
        const sql = 'select * from fornecedor f inner join pessoa p on f.pes_codigo = p.pes_codigo where f.pes_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let fornecedor = await Conversao.converteFornecedor(result[0]);
                    
                    resolve(fornecedor);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Fornecedor;