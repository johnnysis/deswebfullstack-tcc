const db = require('../database/db.js');
const Pessoa = require('./pessoa');
const Cidade = require('./cidade');
const Telefone = require('./telefone');

class Conversao {
    static async converteCliente(result) {
        let cidade = await Cidade.getByCodigo(result.cid_codigo);
        
        let usu = new Cliente(
            result.pes_codigo,
            result.pes_nome,
            cidade,
            result.pes_logradouro,
            result.pes_bairro,
            result.pes_numero,
            result.pes_cep,
            result.pes_email,
            result.cli_cpf);
        return usu;
    }
}

class Cliente extends Pessoa {
    constructor(codigo, nome, cidade, logradouro, bairro, numero, cep, email, cpf, telefones = null) {
        super(codigo, nome, cidade, logradouro, bairro, numero, cep, email, telefones);
        this.cpf = cpf;
    }
    async save() {
        let params = [];
        let sql = ``;
        if(this.codigo === 0) {
            this.codigo = await super.save();
            params = [this.codigo, this.cpf];
            sql = `insert into cliente(pes_codigo, cli_cpf)
                    values(?, ?)`;
        }
        else {
            super.save();
            sql = `update cliente set cli_cpf = ?
                        where pes_codigo = ?`;
            params = [this.cpf, this.codigo];
        }
        
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(() => {
                    // this.salvarTelefones();
                    resolve(this.codigo)
                })
                .catch(err => reject(err));
        });
    }
    static async salvarTelefones(codigo, telefones) {
        try {
            
            await Telefone.excluirTelefonesPorCliente(codigo);
            for(let tel of telefones) {
                tel.save();
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    

    remove() {
        const sql = "delete from cliente where cli_cpf = ?";
        const params = [this.cpf];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => {
                super.remove();
                resolve(numberRows);
            })
            .catch(err => reject(err));
        });
    }
    static getlistaClientes() {
        var sql = 'select * from cliente f inner join pessoa p on f.pes_codigo = p.pes_codigo';

        return new Promise((resolve, reject) => {
            db.select(sql)
            .then(async function(rLista) {
                let listaClientes = [];
                for (const el of rLista) {
                    let cidade = await Cidade.getByCodigo(el.cid_codigo);
                    let telefones = await Telefone.getListaTelefonesPorCliente(el.pes_codigo);

                    listaClientes.push(new Cliente(
                        el.pes_codigo,
                        el.pes_nome,
                        cidade,
                        el.pes_logradouro,
                        el.pes_bairro,
                        el.pes_numero,
                        el.pes_cep,
                        el.pes_email,
                        el.cli_cpf,
                        telefones));
                }
                resolve(listaClientes);
            })
            .catch(reason => reject(reason));
        });
    }
    
    static getByCpf(cpf) {
        const sql = "select * from cliente c inner join pessoa p on c.pes_codigo = p.pes_codigo where c.cli_cpf like ?";
        const params = [`%${cpf}%`];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let cliente = await Conversao.converteCliente(result[0]);
                    
                    resolve(cliente);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }

    static getListByCpf(cpf) {
        const sql = "select * from cliente c inner join pessoa p on c.pes_codigo = p.pes_codigo where c.cli_cpf like ?";
        const params = [`%${cpf}%`];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(async function (result) {
                    var clientes = [];
                    if (result && result.length > 0) {
                        for (let el of result) {
                            let cliente = await Conversao.converteCliente(el);
                            clientes.push(cliente);
                        }

                        resolve(clientes);
                    }
                    else
                        resolve(null);
                })
                .catch(err => reject(err));
        });
    }

    static getListByNome(nome) {
        const sql = "select * from cliente c inner join pessoa p on c.pes_codigo = p.pes_codigo where p.pes_nome like ?";
        const params = [`%${nome}%`];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(async function (result) {
                    var clientes = [];
                    if (result && result.length > 0) {
                        for (let el of result) {
                            let cliente = await Conversao.converteCliente(el);
                            clientes.push(cliente);
                        }

                        resolve(clientes);
                    }
                    else
                        resolve(null);
                })
                .catch(err => reject(err));
        });
    }

    static getByCodigo(codigo) {
        const sql = 'select * from cliente c inner join pessoa p on c.pes_codigo = p.pes_codigo where c.pes_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let cliente = await Conversao.converteCliente(result[0]);
                    
                    resolve(cliente);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Cliente;