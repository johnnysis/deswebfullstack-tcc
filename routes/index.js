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

const inicializaRotas = (app) => {
    // app.use('/', indexRouter);
    app.use('/pessoas', pessoasRouter);
    app.use('/clientes', clientesRouter);
    app.use('/fornecedores', fornecedoresRouter);
    app.use('/usuarios', usuariosRouter);
    app.use('/cidades', cidadesRouter);
    app.use('/estados', estadosRouter);
    app.use('/categorias', categoriasRouter);
    app.use('/formaspagamento', formasPagamentoRouter);
    app.use('/produtos', produtosRouter);
    app.use('/vendas', vendasRouter);
    app.use('/compras', comprasRouter)
};

module.exports = { inicializaRotas };