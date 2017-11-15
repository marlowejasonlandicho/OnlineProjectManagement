var db = require('../../../config/db');

exports.create = function (req, res, next) {
    var task = req.body;

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        var values = [
            task.taskname,
            task.assignedto,
            task.departmentid,
            task.startdate,
            task.duedate,
            task.creator,
            task.details,
            task.progress,
            task.datecompleted
        ];
        connection.query(
                'INSERT INTO task (taskname, assignedto, departmentid, startdate, duedate, creator, details, progress, datecompleted) ' +
                'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    res.json(result);
                });
    });
};

exports.completedTasks = function (req, res, next) {
    var query = 'SELECT t.taskid, d.departmentName, t.taskname, concat(u.lastname, \', \' , u.firstname) as assignedto, t.datecompleted ' +
            'FROM task t, department d, user u ' +
            'WHERE d.departmentid = t.departmentid and t.assignedto = u.userid and t.progress >= 1';

    var values = [];

    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                query,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    if (result) {
                        if (result.length > 0) {
                            res.json(result);
                        } else if (result.length === 0) {
//                        res.json({success: false, message: 'No records found'});
                            res.json([]);
                        }
                    }
                });
    });
};

exports.list = function (req, res, next) {
    var query = 'SELECT task.*, status.statusid, status.statustext, status.type, status.periodnumber ' +
            'FROM task LEFT JOIN status ' +
            'ON task.taskid = status.taskid ' +
            'WHERE progress < 1 AND duedate > NOW() ' +
            'ORDER BY task.taskid, status.periodnumber';
//    var query = 'SELECT * FROM task WHERE progress < 1 AND duedate > NOW()';
    var values = [];

    if (req.query.departmentid) {
        query += ' AND departmentid = ? ';
        values.push(req.query.departmentid);
    }

    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                query,
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    if (result) {
                        if (result.length > 0) {
                            res.json(result);
                        } else if (result.length === 0) {
//                        res.json({success: false, message: 'No records found'});
                            res.json([]);
                        }
                    }
                });
    });
};

exports.read = function (req, res) {
    res.json(req.task);
};

exports.taskByID = function (req, res, next, id) {
    var values = [id];
    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                'SELECT * FROM task WHERE taskid = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        return next(err);
//                        res.json({message: err});
                    }
                    if (result) {
                        if (result.length === 1) {
                            req.task = result[0];
                            next();
//                        res.json(result[0]);
                        } else if (result.length === 0) {
                            next({success: false, message: 'No records found'});
                        }
                    }
                });
    });
};

exports.update = function (req, res) {
    var task = req.body;
    var values = [
//        task.taskname,
        task.assignedto,
        task.departmentid,
//        task.startdate,
//        task.duedate,
//        task.creator,
//        task.details,
        task.progress,
        task.datecompleted,
        task.taskid
    ];

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        connection.query(
                'UPDATE task SET assignedto = ?, departmentid = ?, progress = ?, datecompleted = ? WHERE taskid = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    res.json(result);
                });
    });
};
exports.delete = function (req, res) {
    var task = req.task;
    var taskId = task.taskid;

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        connection.query(
                'DELETE FROM status WHERE taskid = ?',
                [taskId],
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }

                    db.get(db.WRITE, function (err, connection) {
                        if (err) {
                            res.json({message: err});
                        }
                        connection.query(
                                'DELETE FROM task WHERE taskid = ?',
                                [taskId],
                                function (err, result) {
                                    connection.release();
                                    if (err) {
                                        res.json({message: err});
                                    }
                                    res.json(result);
                                });
                    });
                });
    });
};