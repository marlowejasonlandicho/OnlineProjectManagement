var departments = require('../../app/controllers/mysql/department.controller'),
        config = require('../../config/config'),
        expressJwt = require('express-jwt');
var authenticate = expressJwt({secret: config.sessionSecret});

module.exports = function (app) {
    app.route('/api/listDepartmentsFromAD')
            .get(authenticate, departments.listADDepartments);
    app.route('/api/departments')
            .get(authenticate, departments.list)
            .post(authenticate, departments.create);
    app.route('/api/departments/:departmentid')
            .get(authenticate, departments.read)
            .put(authenticate, departments.update)
            .delete(authenticate, departments.delete);
    app.param('departmentid', departments.departmentByID);
};