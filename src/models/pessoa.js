const db = require('../database/db');
const Cidade = require('../models/cidade');

class Pessoa {
    constructor(codigo, nome, cidade, logradouro, bairro, numero, cep, email) {
        Object.assign(this, { codigo, nome, cidade, logradouro, bairro, numero, cep, email });
    }
    save() {
        let sql = '';
        let params = [this.nome, this.cidade.codigo, this.logradouro, this.bairro, this.numero, this.cep, this.email];
        if(this.codigo === 0)
            sql = `insert into pessoa(pes_codigo, pes_nome, cid_codigo, pes_logradouro, pes_bairro, pes_numero, pes_cep, pes_email)
                    values(null, ?, ?, ?, ?, ?, ?, ?)`;
        else {
            sql = `update pessoa set pes_nome = ?, cid_codigo = ?, pes_logradouro = ?, pes_bairro = ?, pes_numero = ?, pes_cep = ?, pes_email = ?
                        where pes_codigo = ?`;
            params.push(this.codigo);
        }
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(insertedCodigo => {
                    insertedCodigo !== 0 ? this.codigo = insertedCodigo : this.codigo = 0
                    resolve(this.codigo);
                })
                .catch(err => reject(err));
        });
    }
    remove() {
        const sql = "delete from pessoa where pes_codigo = ?";
        const params = [this.codigo];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => resolve(numberRows))
            .catch(err => reject(err));
        });
    }
    static getListaPessoas() {
        return new Promise((resolve, reject) => {
            db.select('select * from pessoa')
                .then(async function(rLista) {
                    let listaPessoas = [];
                    for (const el of rLista) {
                        let cidade = await Cidade.selectByCodigo(el.cid_codigo);
                        
                        listaPessoas.push(new Pessoa(
                            el.pes_codigo,
                            el.pes_nome,
                            cidade,
                            el.pes_logradouro,
                            el.pes_bairro,
                            el.pes_numero,
                            el.pes_cep,
                            el.pes_email));
                    }
                    resolve(listaPessoas);
                })
                .catch(reason => reject(reason));
        });
    }
}

module.exports = Pessoa;