var passport = require('passport'),
        config = require('../config'),
        LdapStrategy = require('passport-ldapauth').Strategy;

module.exports = function () {

    passport.use(
            new LdapStrategy({
                server: {
                    url: config.ldapurl,
                    bindDN: config.ldapbinddn,
                    bindCredentials: config.ldapbindcredentials,
                    searchBase: config.ldapsearchbase,
                    searchFilter: '(uid={{username}})'
                }
            },
                    function (user, done) {
                        return done(null, user);
                    }));
};