const db = require('../database/db')
const Cliente = require('./cliente');
const FormaPagamento = require('./formaPagamento');
const ItemVenda = require('./itemVenda');
const Produto = require('./produto');

class Conversao {
    static async converteVenda(result) {
        let formaPagamento = await FormaPagamento.getByCodigo(result.fpa_codigo);
        let cliente = await Cliente.getByCodigo(result.pes_codigo);
        
        let venda = new Venda(
            result.ven_codigo,
            cliente,
            formaPagamento,
            result.ven_valor_total,
            result.ven_valor_total_com_desconto,
            result.ven_pago,
            result.ven_entregue);
        return venda;
    }
}

class Venda {
    constructor(codigo, cliente, formaPagamento, valorTotal, valorTotalComDesconto, pago, entregue) {
        Object.assign(this, { codigo, cliente, formaPagamento, valorTotal, valorTotalComDesconto, pago, entregue });
    }
    
    async save() {
        let sql = '';
        let params = [this.cliente.codigo, this.formaPagamento.codigo, this.valorTotal, this.valorTotalComDesconto, this.pago, this.entregue];
        if(this.codigo === 0)
            sql = `insert into venda(ven_codigo, pes_codigo, fpa_codigo, ven_valor_total, ven_valor_total_com_desconto, ven_pago, ven_entregue)
                    values(null, ?, ?, ?, ?, ?, ?)`;
        else {
            sql = `update venda set pes_codigo, fpa_codigo, ven_valor_total, ven_valor_total_com_desconto, ven_pago, ven_entregue
                        where ven_codigo = ?`;
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
        const sql = "delete from venda where ven_codigo = ?";
        const params = [this.codigo];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => resolve(numberRows))
            .catch(err => reject(err));
        });
    }

    static async gravarItensDaVenda(codigo, itensDaVenda) {
        await Venda.excluirItensDaVenda(codigo);
        for(let item of itensDaVenda) {
            let produto = await Produto.getByCodigo(item.produto.codigo);
            produto.atualizaEstoque(produto.quantidade - item.quantidade);
            
            item.save();
        }
    }

    static getItensDaVenda(vendaCodigo) {
        var sql = 'select * from item_venda where ven_codigo = ?';
        var params = [vendaCodigo];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(rLista) {
                let listaItensdaVenda = [];
                for (const el of rLista) {           
                    let produto = await Produto.getByCodigo(el.pro_codigo);
                    // let ven = await Venda.getByCodigo(el.ven_codigo);
                    listaItensdaVenda.push(new ItemVenda(
                        {codigo: el.ven_codigo}, // new Venda(el.ven_codigo),
                        produto,
                        el.ite_quantidade));
                }
                resolve(listaItensdaVenda);
            })
            .catch(reason => reject(reason));
        });
    }

    static async excluirItensDaVenda(vendaCodigo) {
        let lista = await Venda.getItensDaVenda(vendaCodigo);
        for(let el of lista) {
            el.produto.atualizaEstoque(el.produto.quantidade+=el.quantidade);
        }

        const sql = "delete from item_venda where ven_codigo = ?";
        const params = [vendaCodigo];
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => {
                resolve(numberRows);
            })
            .catch(err => reject(err));
        });
    }

    static getByCodigo(codigo) {
        const sql = 'select * from venda where ven_codigo = ?';
        const params = [codigo];
        
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    
                    let ven = await Conversao.converteVenda(result[0]);
                    resolve(ven);
                }   
                else
                    resolve(null)
            })
            .catch(err => resolve(err));
        });
    }

    static getListaVendas() {
        const sql = `select * from venda v;`;

        return new Promise((resolve, reject) => {
            db.select(sql)
            .then(async function(rLista) {
                if(rLista.length > 0)
                {
                    let listaVendas = [];
                    for(let el of rLista)
                        listaVendas.push(await Conversao.converteVenda(el))
                    resolve(listaVendas);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Venda;