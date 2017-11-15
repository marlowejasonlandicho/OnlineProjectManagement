var status = require('../../app/controllers/mysql/status.controller'),
        config = require('../../config/config'),
        expressJwt = require('express-jwt');
var authenticate = expressJwt({secret: config.sessionSecret});

module.exports = function (app) {
    app.route('/api/status')
            .get(authenticate, status.list)
            .post(authenticate, status.create);
    app.route('/api/weeklystatus')
            .get(authenticate, status.listWeekly);
    app.route('/api/monthlystatus')
            .get(authenticate, status.listMonthly);
    app.route('/api/status/:statusId')
            .get(authenticate, status.read)
            .put(authenticate, status.update)
            .delete(authenticate, status.delete);
    app.param('statusId', status.statusByID);
};