var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var routes = require('./routes')
var app = express();
var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

routes.inicializaRotas(app);

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});