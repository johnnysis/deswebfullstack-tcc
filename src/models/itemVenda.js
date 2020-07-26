const db = require('../database/db');
const Venda = require('./venda');
const Produto = require('./produto');

class ItemVenda {
    constructor(venda, produto, quantidade) {
        Object.assign(this, { venda, produto, quantidade });
    }

    async save() {
        let params = [];
        let sql = ``;
        params = [this.venda.codigo, this.produto.codigo, this.quantidade];
        sql = `insert into item_venda(ven_codigo, pro_codigo, ite_quantidade)
                values(?, ?, ?)`;
        
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(() => resolve(this.codigo))
                .catch(err => reject(err));
        });
    }
}

// console.log(new Venda());
module.exports = ItemVenda;