const db = require('../database/db');
const Categoria = require('./categoria');

class Produto {
    constructor(codigo, descricao, categoria, quantidade, preco) {
        Object.assign(this, { codigo, descricao, categoria, quantidade, preco });
    }
    save() {
        let sql = '';
        let params = [this.descricao, this.categoria.codigo, this.quantidade, this.preco];
        if(this.codigo === 0)
            sql = `insert into produto(pro_codigo, pro_descricao, cat_codigo, pro_quantidade, pro_preco)
                    values(null, ?, ?, ?, ?)`;
        else {
            sql = `update produto set pro_descricao = ?, cat_codigo = ?, pro_quantidade = ?, pro_preco = ?
                        where pro_codigo = ?`;
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
        const sql = "delete from produto where pro_codigo = ?";
        const params = [this.codigo];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => resolve(numberRows))
            .catch(err => reject(err));
        });
    }

    atualizaEstoque(quantidade) {
        this.quantidade = quantidade;
        this.save();
    }
    static getListaProdutos() {
        return new Promise((resolve, reject) => {
            db.select('select * from produto')
                .then(async function(rLista) {
                    let listaProdutos = [];
                    for (const el of rLista) {
                        let categoria = await Categoria.getByCodigo(el.cat_codigo);
                        listaProdutos.push(new Produto(
                            el.pro_codigo,
                            el.pro_descricao,
                            categoria,
                            el.pro_quantidade,
                            el.pro_preco
                        ));
                    }
                    resolve(listaProdutos);
                })
                .catch(reason => reject(reason));
        });
    }

    static getListByDescricao(descricao) {
        const sql = 'select * from produto where pro_descricao like ?';
        const params = [`%${descricao}%`];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(async function (result) {

                    if (result && result.length > 0) {
                        let produtos = [];
                        for (let el of result) {
                            let categoria = await Categoria.getByCodigo(el.cat_codigo);
                            let produto = new Produto(
                                el.pro_codigo,
                                el.pro_descricao,
                                categoria,
                                el.pro_quantidade,
                                el.pro_preco);

                            produtos.push(produto);
                        }

                        resolve(produtos);
                    }
                    else
                        resolve(null);
                })
                .catch(err => reject(err));
        });
    }

    static getByCodigo(codigo) {
        const sql = 'select * from produto where pro_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    
                    let categoria = await Categoria.getByCodigo(result[0].cat_codigo);
                    let produto = new Produto(
                        result[0].pro_codigo,
                        result[0].pro_descricao,
                        categoria,
                        result[0].pro_quantidade,
                        result[0].pro_preco);
                    resolve(produto);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Produto;