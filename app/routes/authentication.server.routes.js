var auth = require('../../app/controllers/authentication.controller');

module.exports = function (app) {
//    app.post('/api/authenticate', auth.authenticate);
//    app.post('/api/authenticate', auth.authenticateLDAPUser);
    app.post('/api/authenticate', auth.authenticateADUser);

};