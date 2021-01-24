let pessoasRouter = require('./pessoas.js');
let clientesRouter = require('./clientes.js');
let fornecedoresRouter = require('./fornecedores.js');
let usuariosRouter = require('./usuarios');
let cidadesRouter = require('./cidades');
let estadosRouter = require('./estados');
let categoriasRouter = require('./categorias');
let formasPagamentoRouter = require('./formasPagamento');
let produtosRouter = require('./produtos');
let vendasRouter = require('./vendas');
let comprasRouter = require('./compras');
let loginRouter = require('./login');
const login = require('../middlewares/login');

const inicializaRotas = (app) => {
    // app.use('/', indexRouter);
    app.use('/pessoas', login, pessoasRouter);
    app.use('/clientes', login, clientesRouter);
    app.use('/fornecedores', login, fornecedoresRouter);
    app.use('/usuarios', login, usuariosRouter);
    app.use('/cidades', login, cidadesRouter);
    app.use('/estados', login, estadosRouter);
    app.use('/categorias', login, categoriasRouter);
    app.use('/formaspagamento', login, formasPagamentoRouter);
    app.use('/produtos', login, produtosRouter);
    app.use('/vendas', login, vendasRouter);
    app.use('/login', loginRouter);
    app.use('/compras', login, comprasRouter)
};

module.exports = { inicializaRotas };