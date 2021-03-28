const db = require('../database/db');
const Compra = require('./compra');
const Produto = require('./produto');

class ItemCompra {
    constructor(compra, produto, quantidade, valorUnitario) {
        Object.assign(this, { compra, produto, quantidade, valorUnitario });
    }

    async save() {
        let params = [];
        let sql = ``;
        params = [this.compra.codigo, this.produto.codigo, this.quantidade, this.valorUnitario];
        sql = `insert into item_compra(com_codigo, pro_codigo, ite_quantidade, ite_valorunitario)
                values(?, ?, ?, ?)`;
        
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(() => resolve(this.codigo))
                .catch(err => reject(err));
        });
    }
}
module.exports = ItemCompra;