const db = require('../database/db');
const Pessoa = require('./pessoa');
const Cidade = require('./cidade');

class Conversao {
    static async converteUsuario(result) {
        let cidade = await Cidade.getByCodigo(result.cid_codigo);
        
        let usu = new Usuario(
            result.pes_codigo,
            result.pes_nome,
            cidade,
            result.pes_logradouro,
            result.pes_bairro,
            result.pes_numero,
            result.pes_cep,
            result.pes_email,
            result.usu_login,
            result.usu_senha);
        return usu;
    }
}

class Usuario extends Pessoa {
    constructor(codigo, nome, cidade, logradouro, bairro, numero, cep, email, login, senha) {
        super(codigo, nome, cidade, logradouro, bairro, numero, cep, email);
        
        this.login = login;
        this.senha = senha; //Adicionar nível de usuário.
    }
    async save() {
        
      	let params = [];
        let sql = ``;
      	if(this.codigo === 0) {
            let insertedCodigo = await super.save();
            this.codigo = insertedCodigo;
			params = [insertedCodigo, this.login, this.senha];
			sql = `insert into usuario(pes_codigo, usu_login, usu_senha)
                    values(?, ?, ?)`;
            
		}
      	else {
			super.save();
			sql = `update usuario set usu_senha = ?
						where pes_codigo = ?`;
			params = [this.senha, this.codigo];
		}
		return new Promise((resolve, reject) => {
            db.save(sql, params)
            .then(() => resolve(this.codigo))
            .catch(err => reject(err));
		});
    }

    remove() {
        const sql = "delete from usuario where usu_login = ?";
        const params = [this.login];
        
        return new Promise((resolve, reject) => {
            db.remove(sql, params)
            .then(numberRows => {
                super.remove();
                resolve(numberRows);
            })
            .catch(err => reject(err));
        });
    }
    static getByLogin(login) {
        const sql = 'select * from usuario u inner join pessoa p on u.pes_codigo = p.pes_codigo where u.usu_login = ?';
        const params = [login];
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                console.log(result.length);
                if(result.length > 0)
                {
                    let usu = await Conversao.converteUsuario(result[0]);
                    resolve(usu);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
    static getByCodigo(codigo) {
        const sql = 'select * from usuario u inner join pessoa p on u.pes_codigo = p.pes_codigo where u.pes_codigo = ?';
        const params = [codigo];
        return new Promise((resolve, reject) => {
            db.select(sql, params)
            .then(async function(result) {
                if(result.length > 0)
                {
                    let usu = await Conversao.converteUsuario(result[0]);
                    resolve(usu);
                }   
                else
                    resolve(null);
            })
            .catch(err => reject(err));
        });
    }
    static getListaUsuarios() {
        const sql = 'select * from usuario u inner join pessoa p on u.pes_codigo = p.pes_codigo';

        return new Promise((resolve, reject) => {
            db.select(sql)
            .then(async function(rLista) {
                let listaUsuarios = [];
                for (const el of rLista)
                    listaUsuarios.push(await Conversao.converteUsuario(el));
                resolve(listaUsuarios);
            })
            .catch(reason => reject(reason));
        });
    }

}

// let usu = new Usuario(0, 'teste 1', { codigo: 2 }, 'teste', 'teste', 'teste', 'teste', 'teste', 'teste', 'login Teste', 'senha Teste');
// usu.save();

// Usuario.getByLogin("joao.teste").then(result => console.log(result));


module.exports = Usuario;