const db = require('../database/db');


class Categoria {
    constructor(codigo, descricao) {
        Object.assign(this, { codigo, descricao });
    }
    save() {
        let sql = '';
        let params = [this.descricao];
        if(this.codigo === 0)
            sql = `insert into categoria(cat_codigo, cat_descricao)
                    values(null, ?)`;
        else {
            sql = `update categoria set cat_descricao = ?
                        where cat_codigo = ?`;
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
        const sql = "delete from categoria where cat_codigo = ?";
        const params = [this.codigo];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => resolve(numberRows))
            .catch(err => reject(err));
        });
    }
    static getListaCategorias() {
        return new Promise((resolve, reject) => {
            db.select('select * from categoria')
                .then(async function(rLista) {
                    let listaCategorias = [];
                    for (const el of rLista) {
                        listaCategorias.push(new Categoria(
                            el.cat_codigo,
                            el.cat_descricao
                        ));
                    }
                    resolve(listaCategorias);
                })
                .catch(reason => reject(reason));
        });
    }
    static getByCodigo(codigo) {
        const sql = 'select * from categoria where cat_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let categoria = new Categoria(result[0].cat_codigo, result[0].cat_descricao);
                    
                    resolve(categoria);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Categoria;