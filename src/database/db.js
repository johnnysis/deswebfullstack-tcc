const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'mysql.joaomcnasc.kinghost.net',
    user: 'joaomcnasc_add1',
    password: 'joao@1234',
    database: 'joaomcnasc'
});

con.connect(err => {
    if(err) throw err;
});

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

// async function Teste() {
//     await
// }

// async function Teste() {
//     try {
//         let res = await select('select * from pessoa');
//         console.log(res);
//     }
//     catch(e) {
//         console.log(e);
//     }
    
// }

// Teste();

// select('select * from pessoa').then((result) => { console.log(result)}).catch((err) => console.log(err));


// class DBConnection {

//     insert(sql) {

//     }
//     select(sql) {

//         return new Promise((resolve, reject) => {
//             con.query(sql, function (err, result) {
//                 if (err) reject(err);
//                 // console.log("Result: " + result);
//                 else resolve(result);
//             });
//         });
        
//     }
// }

// module.exports = DBConnection;

// module.exports = con;

//node guarda cache dos módulos, portanto não precisa ser singleton.

// t = {
//     valor: 1,
//     inc() {
//         this.valor++;
//     }
// }

// t = () => {
//     return {
//         valor: 1,
//         inc() {
//             this.valor++;
//         }
//     }
// }
// class Connection {
//     private constructor(con) {
//         this.
//     }
// }