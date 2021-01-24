const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const { GOOGLE_CONFIG } = require('../../config');
const keys = require('./keys');

// const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile)

module.exports = () => {
    passport.serializeUser((user, cb) => cb(null, user))
    passport.deserializeUser((obj, cb) => cb(null, obj))

    passport.use(
        new GoogleStrategy(GOOGLE_CONFIG,
        (accessToken, refreshToken, profile, cb) => cb(null, profile))
    );
}