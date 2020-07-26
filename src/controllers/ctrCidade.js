const Cidade = require('../models/cidade');

class CtrCidade {
    static async get(req, res, next) {
        try
        {
            var codigoEstado = req.query.codigoEstado;
            var listaCidades = await Cidade.getListaCidades(codigoEstado);
            res.send(listaCidades);   
        }
        catch(err)
        {
            res.status(500).send({erro: err});
        }
    }
}

module.exports = CtrCidade;