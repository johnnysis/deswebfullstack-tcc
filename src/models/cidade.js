const db = require('../database/db')
const Estado = require('./estado');

class Cidade {
    constructor(codigo, estado, nome) {
        Object.assign(this, { codigo, estado, nome });
    }

    static getByCodigo(codigo) {
        let params = [codigo];
        let sql = `select * from cidade c inner join estado e on c.est_codigo = e.est_codigo
                    where cid_codigo = ?`;

        return new Promise((resolve, reject) => {
            db.select(sql, params)
                .then(result => {
                    if(result.length > 0)
                    {
                        let rCidade = result[0];
                        let estado = new Estado(
                            rCidade.est_codigo,
                            rCidade.est_uf,
                            rCidade.est_descricao
                        );
                        resolve(new Cidade(rCidade.cid_codigo, estado, rCidade.cid_nome));
                    }
                    else
                        resolve(null);
                })
        })
    }

    static async getListaCidades(codigoEstado) {
        var params = [codigoEstado];

        var estado = await Estado.selectByCodigo(codigoEstado);

        if(estado != null)
        {
            //tratar cruzamento de informações com o da tabela pessoa
            return new Promise((resolve, reject) => {
                db.select('select * from cidade where est_codigo = ?', params)
                    .then(rLista => {
                        var listaCidades = [];
                        rLista.forEach(el => {
                            listaCidades.push(new Cidade(el.cid_codigo, estado, el.cid_nome));
                        });
                        resolve(listaCidades);
                    })
                    .catch(reason => reject(reason));
            });
        }
        else
            throw 'Estado não encontrado';
    }
}

module.exports = Cidade;