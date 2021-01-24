const express = require('express');
const passport = require('passport');
const login = express.Router();
// const passportSetup = require('../configs/passport-setup');

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const ctrLogin = require("../controllers/ctrLogin");


login.post('/', ctrLogin.login);
login.post('/logout', ctrLogin.logout);
login.get('/validToken', ctrLogin.validToken);
login.get('/google', googleAuth);

login.get('/google/redirect', googleAuth, ctrLogin.google);

module.exports = login;