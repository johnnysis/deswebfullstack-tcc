const keys = require("./src/configs/keys");

var config = {};

config.privateKey="LojaJM"; //também adicionar às variáveis de ambiente.

// exports.TWITTER_CONFIG = {
//     consumerKey: process.env.TWITTER_KEY,
//     consumerSecret: process.env.TWITTER_SECRET,
//     callbackURL: twitterURL,
// }

exports.config = config;

//colocar essas informações em variáveis de ambiente
exports.GOOGLE_CONFIG = {
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
}

// exports.FACEBOOK_CONFIG = {
//     clientID: process.env.FACEBOOK_KEY,
//     clientSecret: process.env.FACEBOOK_SECRET,
//     profileFields: ['id', 'emails', 'name', 'picture.width(250)'],
//     callbackURL: facebookURL
// }


