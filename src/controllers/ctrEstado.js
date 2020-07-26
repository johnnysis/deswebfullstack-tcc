const Estado = require('../models/estado');

class CtrEstado {
    static async get(req, res, next) {
        try
        {
            var listaEstados = await Estado.getListaEstados();
            res.send(listaEstados);   
        }
        catch(err)
        {
            res.status(500).send({erro: err});
        }
    }
}

module.exports = CtrEstado;