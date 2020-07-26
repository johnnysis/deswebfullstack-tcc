const db = require('../database/db')
const Fornecedor = require('./fornecedor');
const ItemCompra = require('./itemCompra');
const Produto = require('./produto');

class Conversao {
    static async converteCompra(result) {
        let fornecedor = await Fornecedor.getByCodigo(result.pes_codigo);
        
        let compra = new Compra(
            result.com_codigo,
            fornecedor,
            result.com_valor_total);
        return compra;
    }
}

class Compra {
    constructor(codigo, fornecedor, valorTotal) {
        Object.assign(this, { codigo, fornecedor, valorTotal });
    }
    
    async save() {
        let sql = '';
        let params = [this.fornecedor.codigo, this.valorTotal];
        if(this.codigo === 0)
            sql = `insert into compra(com_codigo, pes_codigo, com_valor_total)
                    values(null, ?, ?)`;
        else {
            sql = `update compra set pes_codigo, com_valor_total
                        where com_codigo = ?`;
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
        const sql = "delete from compra where com_codigo = ?";
        const params = [this.codigo];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => resolve(numberRows))
            .catch(err => reject(err));
        });
    }

    static async gravarItensDaCompra(codigo, itensDaCompra) {
        await Compra.excluirItensDaCompra(codigo);
        for(let item of itensDaCompra) {
            let produto = await Produto.getByCodigo(item.produto.codigo);
            produto.atualizaEstoque(produto.quantidade + item.quantidade);
            
            item.save();
        }
    }

    static getItensDaCompra(compraCodigo) {
        var sql = 'select * from item_compra where com_codigo = ?';
        var params = [compraCodigo];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(rLista) {
                let listaItensDaCompra = [];
                for (const el of rLista) {           
                    let produto = await Produto.getByCodigo(el.pro_codigo);
                    listaItensDaCompra.push(new ItemCompra(
                        {codigo: el.com_codigo},
                        produto,
                        el.ite_quantidade));
                }
                resolve(listaItensDaCompra);
            })
            .catch(reason => reject(reason));
        });
    }

    static async excluirItensDaCompra(compraCodigo) {
        let lista = await Compra.getItensDaCompra(compraCodigo);
        for(let el of lista) {
            el.produto.atualizaEstoque(el.produto.quantidade - el.quantidade);
        }

        const sql = "delete from item_compra where com_codigo = ?";
        const params = [compraCodigo];
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => {
                resolve(numberRows);
            })
            .catch(err => reject(err));
        });
    }

    static getByCodigo(codigo) {
        const sql = 'select * from compra where com_codigo = ?';
        const params = [codigo];
        
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    
                    let com = await Conversao.converteCompra(result[0]);
                    resolve(com);
                }   
                else
                    resolve(null)
            })
            .catch(err => resolve(err));
        });
    }

    static getListaCompras() {
        const sql = `select * from compra c;`;

        return new Promise((resolve, reject) => {
            db.select(sql)
            .then(async function(rLista) {
                if(rLista.length > 0)
                {
                    let listaCompras = [];
                    for(let el of rLista)
                        listaCompras.push(await Conversao.converteCompra(el));
                    resolve(listaCompras);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Compra;