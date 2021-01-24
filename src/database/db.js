const mysql = require('mysql');

const con = mysql.createPool({
    host: 'mysql.joaomcnasc.kinghost.net',
    user: 'joaomcnasc_add1',
    password: 'joao@1234',
    database: 'joaomcnasc'
});

//con.connect(err => {
//    if(err) throw err;
//});

function save(sql, params) {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result) => {
            if(err) reject(err);
            else resolve(result.insertId);
        });
    });
}
function select(sql, params = null) {
    if(!params) {
        return new Promise((resolve, reject) => {
            con.query(sql, function (err, result) {
                if (err) reject(err);
                else { resolve(result);}
            });
        });
    }
    else {
        return new Promise((resolve, reject) => {
            con.query(sql, params, function (err, result) {
                if (err) reject(err);
                else resolve (result);
            });
        });
    }
}
function remove(sql, params) {
    return new Promise((resolve, reject) => {
        con.query(sql, params, function (err, result) {
            if (err) reject(err);
            else resolve(result.affectedRows);
        });
    });
}
module.exports = { select, save, remove };