const db = require('../database/db');
const Cliente = require('./cliente');

// create table telefone(
//     tel_codigo int unsigned not null auto_increment,
//     tel_numero varchar(50),
//     pes_codigo int unsigned not null,
//     primary key(tel_codigo),
//     foreign key(pes_codigo) references pessoa(pes_codigo)
// ); fornecedor e cliente terão lista de telefones. (serão recuperados nas respectivas models).

class Telefone {
    constructor(codigo, numero, cliente) {
        Object.assign(this, { codigo, numero, cliente });
    }

    async save() {
        let params = [];
        let sql = ``;
        if(this.codigo === 0) {
            params = [null, this.numero, this.cliente.codigo];
            sql = `insert into telefone(tel_codigo, tel_numero, pes_codigo)
                    values(?, ?, ?)`;
        }
        
        return new Promise((resolve, reject) => {
            db.save(sql, params)
                .then(() => resolve(this.codigo))
                .catch(err => reject(err));
        });
    }

    static excluirTelefonesPorCliente(pessoaCodigo) {
        const sql = "delete from telefone where pes_codigo = ?";
        const params = [pessoaCodigo];
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => {
                resolve(numberRows);
            })
            .catch(err => reject(err));
        });
    }

    static getListaTelefonesPorCliente(pessoaCodigo) {
        var sql = 'select * from telefone where pes_codigo = ?';
        var params = [pessoaCodigo];

        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(rLista) {
                let listaTelefones = [];
                for (const el of rLista) {                    
                    listaTelefones.push(new Telefone(
                        el.tel_codigo,
                        el.tel_numero,
                        el.pes_codigo));
                }
                resolve(listaTelefones);
            })
            .catch(reason => reject(reason));
        });
    }
    
    static getByCodigo(codigo) {
        const sql = 'select * from telefone where tel_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let cliente = await Cliente.getByCodigo(result[0].pes_codigo);
                    let telefone = new Telefone(
                        result[0].tel_codigo,
                        result[0].tel_numero,
                        cliente);
                    
                    resolve(telefone);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
    static getByCodigoSimplificado(codigo) {
        const sql = 'select * from telefone where tel_codigo = ?';
        const params = [codigo];
        
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result && result.length > 0)
                {
                    let cliente = new Cliente(result[0].pes_codigo);
                    let telefone = new Telefone(
                        result[0].tel_codigo,
                        result[0].tel_numero,
                        cliente);
                    
                    resolve(telefone);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
}

module.exports = Telefone;