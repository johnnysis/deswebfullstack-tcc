const db = require('../database/db');

// create table forma_pagamento(
//     fpa_codigo int unsigned not null auto_increment,
//     fpa_descricao varchar(255),
//     primary key(fpa_codigo)
// );

class FormaPagamento {
    constructor(codigo, descricao) {
        Object.assign(this, { codigo, descricao });
    }
    save() {
        let sql = '';
        let params = [this.descricao];
        if(this.codigo === 0)
            sql = `insert into forma_pagamento(fpa_codigo, fpa_descricao)
                    values(null, ?)`;
        else {
            sql = `update forma_pagamento set fpa_descricao = ?
                        where fpa_codigo = ?`;
            params.push(this.codigo);
        }
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(insertedCodigo => {
                    insertedCodigo !== 0 ? this.codigo = insertedCodigo : this.codigo = 0;
                    resolve(this.codigo);
                })
                .catch(err => reject(err));
        });
    }
    remove() {
        const sql = "delete from forma_pagamento where fpa_codigo = ?";
        const params = [this.codigo];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => resolve(numberRows))
            .catch(err => reject(err));
        });
    }
    static getListaFormaPagamentos() {
        return new Promise((resolve, reject) => {
            db.select('select * from forma_pagamento')
                .then(async function(rLista) {
                    let listaFormaPagamentos = [];
                    for (const el of rLista) {
                        listaFormaPagamentos.push(new FormaPagamento(
                            el.fpa_codigo,
                            el.fpa_descricao
                        ));
                    }
                    resolve(listaFormaPagamentos);
                })
                .catch(reason => reject(reason));
        });
    }
    static getByCodigo(codigo) {
        const sql = 'select * from forma_pagamento where fpa_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let formaPagamento = new FormaPagamento(result[0].fpa_codigo, result[0].fpa_descricao);
                    
                    resolve(formaPagamento);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = FormaPagamento;