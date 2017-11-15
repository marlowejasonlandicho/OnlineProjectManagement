var email = require('../../app/controllers/email.server.controller');

module.exports = function (app) {
    email.scheduleEmail();
};