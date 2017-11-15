var settings = require('../../app/controllers/mysql/settings.controller'),
        config = require('../../config/config'),
        expressJwt = require('express-jwt');
var authenticate = expressJwt({secret: config.sessionSecret});

module.exports = function (app) {
    app.route('/api/settings')
            .get(authenticate, settings.list)
            .post(authenticate, settings.create);
    app.route('/api/settings/:settingsid')
            .get(authenticate, settings.read)
            .put(authenticate, settings.update)
            .delete(authenticate, settings.delete);
    app.param('settingsid', settings.settingsByID);
    app.route('/api/updatesettings')
            .put(authenticate, settings.update);
};