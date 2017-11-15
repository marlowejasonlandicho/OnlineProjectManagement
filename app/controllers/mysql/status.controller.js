var db = require('../../../config/db');

exports.create = function (req, res, next) {
    var status = req.body;

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        var values = [
            status.statustext,
            status.taskid,
            status.periodnumber,
            status.type,
            status.creator
        ];

        connection.query(
                'INSERT INTO status (statustext, taskid, periodnumber, type, creator) \n\
                VALUES(?, ?, ?, ?, ?)',
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

exports.list = function (req, res, next) {
    var query = 'SELECT taskid, type, statustext, periodnumber FROM status';
    var values = [];

    if (req.query.taskid && req.query.periodnumber && req.query.type) {
        query += ' WHERE taskid = ? AND periodnumber = ? AND type = ?';
        values.push(req.query.taskid);
        values.push(req.query.periodnumber);
        values.push(req.query.type);
    }

    if (req.query.taskid && !req.query.periodnumber && req.query.type) {
        query += ' WHERE taskid = ? AND type = ?';
        values.push(req.query.taskid);
        values.push(req.query.type);
    }

    if (!req.query.taskid && req.query.periodnumber && req.query.type) {
        query += ' WHERE periodnumber = ? AND type = ?';
        values.push(req.query.periodnumber);
        values.push(req.query.type);
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

exports.listWeekly = function (req, res, next) {
    var query = 'SELECT * FROM status WHERE type = "WEEKLY"';
    var values = [];

    if (req.query.taskid) {
        query += ' AND taskid = ?';
        values.push(req.query.taskid);
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

exports.listMonthly = function (req, res, next) {
    var query = 'SELECT * FROM status WHERE type = "MONTHLY"';
    var values = [];

    if (req.query.taskid) {
        query += ' AND taskid = ? ';
        values.push(req.query.taskid);
    }

    db.get(db.READ, function (err, connection) {
        if (err) {
            connection.release();
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
    res.json(req.status);
};

exports.statusByID = function (req, res, next, id) {
    var values = [id];
    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                'SELECT * FROM status WHERE statusid = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        next({message: err});
                    }
                    if (result) {
                        if (result.length === 1) {
                            req.status = result;
                            next();
                        } else if (result.length === 0) {
                            next({success: false, message: 'No records found'});
                        }
                    }
                });
    });
};

exports.update = function (req, res) {
    var status = req.body;
    console.log(req.body);

};
exports.delete = function (req, res) {
    var status = req.body;
};