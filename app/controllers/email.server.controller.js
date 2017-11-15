var mailer = require('nodemailer'),
        db = require('../../config/db.js'),
        emailSchedule = require('node-schedule'),
        handlebars = require('handlebars'),
        async = require('async');
var smtpTransport = {};
var cronSchedule = '',
        smtpHost = '',
        smtpUsername = '',
        smtpUserPw = '',
        fromEmail = '',
        emailSubject = '',
        emailMessage = '',
        appURL;

exports.scheduleEmail = function () {
    db.get(db.READ, function (err, connection) {
        var query = 'SELECT * FROM settings WHERE category = \'EMAIL\'';
        connection.query(
                query,
                function (err, result) {
                    connection.release();
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            var category = result[i];
                            if (category.name === 'email.host') {
                                smtpHost = category.value;
                            } else if (category.name === 'email.user') {
                                smtpUsername = category.value;
                            } else if (category.name === 'email.password') {
                                smtpUserPw = category.value;
                            } else if (category.name === 'email.from') {
                                fromEmail = category.value;
                            } else if (category.name === 'email.subject') {
                                emailSubject = category.value;
                            } else if (category.name === 'email.body') {
                                emailMessage = category.value;
                            } else if (category.name === 'email.schedule') {
                                cronSchedule = category.value;
                            } else if (category.name === 'app.url') {
                                appURL = category.value;
                            }
                        }

                        smtpTransport = mailer.createTransport({
                            host: smtpHost,
                            port: 25
                        });

                        var job = emailSchedule.scheduleJob(cronSchedule, function () {
                            db.get(db.READ, function (err, connection) {
                                connection.query(
                                        'SELECT t.taskid, t.taskname, t.startdate, t.duedate, u.userid, u.firstname, u.email, u.username ' +
                                        'FROM user u, task t WHERE t.assignedto = u.userid AND t.progress < 1 AND t.duedate > NOW() ',
                                        function (err, queryResult) {
                                            connection.release();
                                            queryResult.forEach(function (task, index) {
                                                var noOfWeeks = 1;
                                                var noOfMonths = 1;
                                                var noOfWeekList = [];
                                                var noOfMonthList = [];
                                                noOfWeekList.push(noOfWeeks);
                                                noOfMonthList.push(noOfMonths);

                                                var calculateNoOfWeekends = function (date1, date2) {
                                                    var now = new Date();
                                                    var d1 = new Date(date1),
                                                            d2 = new Date(date2);
                                                    while (d1 < d2 && d1 < now) {
                                                        var day = d1.getDay();
                                                        if (day === 5) {
                                                            noOfWeeks++;
                                                            noOfWeekList.push(noOfWeeks);
                                                        }
                                                        d1.setDate(d1.getDate() + 1);
                                                    }
                                                };
                                                calculateNoOfWeekends(task.startdate, task.duedate);
                                                var calculateNoOfMonths = function (date1, date2) {
                                                    var now = new Date();
                                                    var d1 = new Date(date1),
                                                            d2 = new Date(date2);
                                                    d1.setMonth(d1.getMonth() + 1);
                                                    while (d1 < d2 && d1 < now) {
                                                        noOfMonths++;
                                                        d1.setMonth(d1.getMonth() + 1);
                                                        noOfMonthList.push(noOfMonths);
                                                    }
                                                };
                                                calculateNoOfMonths(task.startdate, task.duedate);

                                                noOfWeekList.forEach(function (localWeekNo, localWeekNoIndex) {
                                                    db.get(db.READ, function (err, connection) {
                                                        connection.query(
                                                                'SELECT periodnumber FROM status WHERE taskid = ? AND type = \'WEEKLY\' AND periodnumber = ?',
                                                                [task.taskid, localWeekNo],
                                                                function (err, periodResult) {
                                                                    connection.release();
                                                                    if (periodResult.length === 0) {
                                                                        var data = {
                                                                            'firstname': task.firstname,
                                                                            'taskname': task.taskname,
                                                                            'period': 'Week',
                                                                            'periodnumber': localWeekNo,
                                                                            'url': appURL + '/quickStatusUpdate?taskid=' + task.taskid + '&periodnumber=' + localWeekNo + '&type=WEEKLY&taskname=' + task.taskname
                                                                        };
                                                                        var template = handlebars.compile(emailMessage);
                                                                        var content = template(data);
                                                                        var subject = emailSubject + 'Week #' + localWeekNo;
                                                                        sendEmail(task.email, subject, content);
                                                                    }
                                                                });
                                                    });
                                                });
                                                noOfMonthList.forEach(function (localMonthNo, localMonthNoIndex) {
                                                    db.get(db.READ, function (err, connection) {
                                                        connection.query(
                                                                'SELECT periodnumber FROM status WHERE taskid = ? AND type = \'MONTHLY\' AND periodnumber = ?',
                                                                [task.taskid, localMonthNo],
                                                                function (err, result) {
                                                                    connection.release();
                                                                    if (result.length === 0) {
                                                                        var data = {
                                                                            'firstname': task.firstname,
                                                                            'taskname': task.taskname,
                                                                            'period': 'Month',
                                                                            'periodnumber': localMonthNo,
                                                                            'url': appURL + '/quickStatusUpdate?taskid=' + task.taskid + '&periodnumber=' + localMonthNo + '&type=MONTHLY'
                                                                        };
                                                                        var template = handlebars.compile(emailMessage);
                                                                        var content = template(data);
                                                                        var subject = emailSubject + 'Month #' + localMonthNo;
                                                                        sendEmail(task.email, subject, content);
                                                                    }
                                                                });
                                                    });
                                                });
                                            });
                                        });
                            });
                        });
                    }
                });
    });
};
var sendEmail = function (email, subject, content) {

    var mail = {
        from: fromEmail,
        to: email,
        subject: subject,
        text: content,
        html: content
    };
    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log('Error sending message to: ' + email + '. Error is:' + error);
        } else {
            console.log('Message sent to: ' + email);
        }
        smtpTransport.close();
    });
};