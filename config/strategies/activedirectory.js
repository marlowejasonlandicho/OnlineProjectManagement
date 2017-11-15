var passport = require('passport'),
        config = require('../config'),
        LocalStrategy = require('passport-local').Strategy,
        ldap = require('ldapjs');

module.exports = function () {
    passport.use(
            new LocalStrategy(
                    function (userName, password, done) {
                        var dn = '';
                        var client = ldap.createClient({url: config.adurl});

                        client.on('error', function (err) {
                            console.log('Unable to connect to AD...');
                            return done(
                                    null,
                                    false,
                                    {success: false, message: 'Unable to connect to AD...'});
                        });

                        var opts = {
                            filter: '(&(samaccountname=' + userName + '))',
                            scope: 'sub',
                            attributes: [
                                'dn',
                                'sn',
                                'sAMAccountName',
                                'userPrincipalName',
                                'cn',
                                'mail',
                                'department',
                                'displayNamePrintable'
                            ]
                        };

                        client.bind(config.adbinddn, config.adbindcredentials, function (err) {});
                        client.search(config.adsearchbase,
                                opts,
                                function (error, search) {
                                    var user = null;
                                    console.log('Searching.....');
                                    search.on('searchEntry', function (entry) {
                                        if (entry.object) {
                                            console.log('entry: %j ' + JSON.stringify(entry.object));
                                            dn = entry.object.dn;
                                            user = {
                                                success: true,
                                                id: entry.object.sAMAccountName,
                                                firstname: entry.object.firstname,
                                                lastname: entry.object.sn,
                                                username: entry.object.sAMAccountName,
                                                email: entry.object.email,
                                                departmentid: '',
                                                roleid: ''
                                            };
                                        } else {
                                            return done(null, false, {success: false, message: 'Invalid User'});
                                        }
                                    });

                                    search.on('end', function (result) {
                                        client.bind(dn, password, function (err) {
                                            if (user && !err) {
                                                console.log('User:' + user);
                                                return done(null, user);
                                            }
                                            if (err) {
                                                console.log('Error:' + err);
                                            }
                                            client.unbind(function (error) {
                                                if (error) {
                                                    console.error('error unbind: ' + error.message);
                                                } else {
                                                    console.log('client disconnected');
                                                }
                                            });
                                            return done(null, false, {success: false, message: 'Invalid User'});
                                        });

                                        console.log('end');
                                    });

                                    search.on('error', function (error) {
                                        console.error('error: ' + error.message);
                                        client.unbind(function (error) {
                                            if (error) {
                                                console.error('error unbind: ' + error.message);
                                            } else {
                                                console.log('client disconnected');
                                            }
                                        });
                                    });
                                });
                    }
            ));
};


