var passport = require('passport'),
        db = require('./db.js');

module.exports = function () {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
//    require('./strategies/activedirectory.js')();
    require('./strategies/local.js')();
//    require('./strategies/ldap.js')();

};