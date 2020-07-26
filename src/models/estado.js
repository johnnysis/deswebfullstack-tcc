const db = require('../database/db.js')

class Estado {
    constructor(codigo, uf, descricao) {
        Object.assign(this, { codigo, uf, descricao });
    }

    static selectByCodigo(codigo) {
        var params = [codigo];
        return new Promise((resolve, reject) => {
            db.select('select * from estado where est_codigo = ?', params)
                .then(result => {
                    if(result.length > 0)
                    {
                        var rEstado = result[0];
                        resolve(new Estado(
                            rEstado.est_codigo,
                            rEstado.est_uf,
                            rEstado.est_descricao
                            )
                        );
                    }
                    else
                        resolve(null);
                })
        })
    }

    static getListaEstados() {
      //converter para os respectivos tipos?
        return new Promise((resolve, reject) => {
            db.select('select * from estado')
                .then(rLista => {
                    var listaEstados = [];

                    rLista.forEach(el => listaEstados.push(
                        new Estado(
                            el.est_codigo,
                            el.est_uf,
                            el.est_descricao
                            )
                        )
                    );

                    resolve(listaEstados);
                })
                .catch(reason => reject(reason));
        });
    }
}

module.exports = Estado;