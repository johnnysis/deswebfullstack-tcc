const moment = require('moment');
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
            result.ven_data,
            result.ven_datapagamento);
        return venda;
    }
}

class Venda {
    //adicionar data da venda e data de pagamento.
    constructor(codigo, cliente, formaPagamento, valorTotal, valorTotalComDesconto, pago, data, dataPagamento) {
        if(data === null)
            data = moment().format("YYYY-MM-DD HH:mm:ss");
        Object.assign(this, { codigo, cliente, formaPagamento, valorTotal, valorTotalComDesconto, pago, data, dataPagamento });
    }
    
    async save() {
        let sql = '';
        let params = [this.cliente.codigo,
            this.formaPagamento ? this.formaPagamento.codigo : null,
            this.valorTotal,
            this.valorTotalComDesconto,
            this.pago,
            this.data,
            this.dataPagamento];

        if (this.codigo === 0)
            sql = `insert into venda(ven_codigo, pes_codigo, fpa_codigo, ven_valor_total,
                    ven_valor_total_com_desconto, ven_pago, ven_data,
                    ven_datapagamento)
                    values(null, ?, ?, ?, ?, ?, ?, ?)`;
        else {
            sql = `update venda set pes_codigo = ?, fpa_codigo = ?,
                ven_valor_total = ?, ven_valor_total_com_desconto = ?,
                ven_pago = ?, ven_data = ?, ven_datapagamento = ?
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

    static getItensDaVenda(codigo) {
        var sql = 'select * from item_venda where ven_codigo = ?';
        var params = [codigo];

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

    static async excluirItensDaVenda(codigo) {
        let lista = await Venda.getItensDaVenda(codigo);
        for(let el of lista) {
            el.produto.atualizaEstoque(el.produto.quantidade+=el.quantidade);
        }

        const sql = "delete from item_venda where ven_codigo = ?";
        const params = [codigo];
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

    static getVendasPorCliente(clienteCodigo) {
        const sql = 'select * from venda where pes_codigo = ? order by ven_codigo';
        const params = [clienteCodigo];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(async function (result) {
                    if (result && result.length > 0) {
                        let vendas = [];
                        for (let r of result) {
                            let v = await Conversao.converteVenda(r);
                            vendas.push(v);
                        }
                        resolve(vendas);
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

    static async relatorioVendasPorAno(ano) {
        const sql = `select count(ven_codigo) as quantidade, month(ven_data) as mes
                        from venda where year(ven_data) = ?
                        group by month(ven_data);`;
        const params = [ano];

        let result = await db.select(sql, params);
        if (result.length > 0) {
            let lista = [];
            for (let el of result)
                lista.push({ mes: el.mes, quantidade: el.quantidade });

            return lista;
        }
        return null;
    }

    static async relatorioVendasPorCategoria() {
        const sql = `select distinct(p.cat_codigo) as codigo_categoria, c.cat_descricao, count(distinct(v.ven_codigo)) quantidade from venda v
            inner join item_venda iv on iv.ven_codigo = v.ven_codigo
            inner join produto p on p.pro_codigo = iv.pro_codigo
            inner join categoria c on p.cat_codigo = c.cat_codigo
            group by codigo_categoria, c.cat_descricao;`;

        let result = await db.select(sql);
        if (result.length > 0) {
            let lista = [];
            for (let el of result)
                lista.push({ categoria: el.cat_descricao, quantidade: el.quantidade });

            return lista;
        }
        return null;
    }
    static async relatorioVendasPorFormaDePagamento() {
        const sql = `select count(ven_codigo) as quantidade, v.fpa_codigo, fp.fpa_descricao from venda v
        inner join forma_pagamento fp on fp.fpa_codigo = v.fpa_codigo
        group by v.fpa_codigo, fp.fpa_descricao;`;

        let result = await db.select(sql);
        if (result.length > 0) {
            let lista = [];
            for (let el of result)
                lista.push({ formaPagamento: el.fpa_descricao, quantidade: el.quantidade });

            return lista;
        }
        return null;
            
    }
    
    static async relatorioPagosNaoPagosPorMesAno(ano) {
        const sql = `select count(case when v.ven_pago = 1 then 1 end) quantidadepago,
                            count(case when v.ven_pago = 0 then 1 end) quantidadenaopago, month(ven_data) as mes
                    from venda v
                    where year(v.ven_data) = ?
                    group by mes;`;
        const params = [ano];
        let result = await db.select(sql, params);
        if (result.length > 0) {
            let lista = [];
            for (let el of result)
                lista.push({
                    quantidadePago: el.quantidadepago,
                    quantidadeNaoPago: el.quantidadenaopago,
                    mes: el.mes
                });

            return lista;
        }
        return null;
    }
}

module.exports = Venda;