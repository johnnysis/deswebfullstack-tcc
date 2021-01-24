var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const passport = require('passport');
// const session = require('express-session');
var routes = require('./src/routes');
const passportSetupInit = require('./src/configs/passport-setup');

var port = process.env.PORT || 5000;

var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
// passport.session();
passportSetupInit();

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

routes.inicializaRotas(app);

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});