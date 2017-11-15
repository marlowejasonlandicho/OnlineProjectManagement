var users = require('../../app/controllers/mysql/user.controller'),
        config = require('../../config/config.js'),
        expressJwt = require('express-jwt');
var authenticate = expressJwt({secret: config.sessionSecret});

module.exports = function (app) {
    app.route('/api/listUsersFromAD')
            .get(authenticate, users.listADUsers);
    app.route('/api/users')
            .get(authenticate, users.list);
    app.route('/api/users/:userId')
            .get(authenticate, users.read)
            .put(authenticate, users.update)
            .delete(authenticate, users.delete);
    app.param('userId', users.userById);
};
