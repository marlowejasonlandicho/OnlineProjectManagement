module.exports = {
    db: '127.0.0.1',
    dbName: 'opm',
    dbUserName: 'root',
    dbPassword: 'password',
    dbConnectionLimit: 1000,
    ldapurl: 'ldap://127.0.0.1:10389',
    ldapbinddn: 'uid=admin,ou=system',
    ldapbindcredentials: 'secret',
    ldapsearchbase: 'ou=users',
    adurl: 'ldap://localhost',
    adbinddn: 'CN=AD Query,CN=OPM Accounts,DC=OPMMAKATI,DC=EDU',
    adbindcredentials: 'password',
    adsearchbase: 'DC=OPM MAKATI,DC=EDU',
    sessionSecret: 'OPM Secret',
    sessionTimeout: 120
};
