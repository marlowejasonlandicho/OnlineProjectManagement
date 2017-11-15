var task = require('../../app/controllers/mysql/task.controller');
var excelexport = require('../../app/controllers/excelexport.server.controller'),
        config = require('../../config/config'),
        expressJwt = require('express-jwt');
var authenticate = expressJwt({secret: config.sessionSecret});

module.exports = function (app) {
    app.route('/api/tasks')
            .get(authenticate, task.list)
            .post(authenticate, task.create);
    app.route('/api/completedtasks')
            .get(authenticate, task.completedTasks);
    app.route('/api/exportcompletedtasks')
            .post(authenticate, excelexport.exportToExcel);
    app.route('/api/tasks/:taskId')
            .get(authenticate, task.read)
            .put(authenticate, task.update)
            .delete(authenticate, task.delete);
    app.param('taskId', task.taskByID);
};