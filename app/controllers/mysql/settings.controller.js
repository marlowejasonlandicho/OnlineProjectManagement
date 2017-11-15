var db = require('../../../config/db.js');

exports.create = function (req, res, next) {
    var settings = req.body;

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        var values = [
            settings.name,
            settings.value,
            settings.category
        ];

        connection.query(
                'INSERT INTO settings (name, value, category) VALUES(?, ?, ?)',
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
    db.get(db.READ, function (err, connection) {
        var query = 'SELECT * FROM settings';
        var values = [];

        if (err) {
            res.json({message: err});
        }

        if (req.query.category) {
            query += ' WHERE category = ? ';
            values.push(req.query.category);
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
                            res.json([]);
                        }
                    }
                });
    });
};

exports.read = function (req, res) {
    res.json(req.settings);
};

exports.settingsByID = function (req, res, next, id) {
    var values = [id];
    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                'SELECT * FROM settings WHERE settingsid = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        next({message: err});
                    }
                    if (result) {
                        if (result.length === 1) {
                            req.settings = result;
                            next();
//                        res.json(result);
                        } else if (result.length === 0) {
                            next({success: false, message: 'No records found'});
                        }
                    }
                });
    });
};

exports.settingsByCategory = function (req, res, next, id) {
    db.get(db.READ, function (err, connection) {
        var values = [req.query.category];

        if (err) {
            res.json({message: err});
        }
        connection.query(
                'SELECT * FROM settings WHERE category = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    if (result) {
                        if (result.length === 1) {
                            res.json(result);
                        } else if (result.length === 0) {
                            res.json({success: false, message: 'No records found'});
                        }
                    }
                });
    });
};

exports.update = function (req, res) {
    var settings = req.body;

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        var values = [
            settings.name,
            settings.value,
            settings.category,
            settings.settingsid
        ];

        connection.query(
                'UPDATE settings SET name = ?, value = ?, category = ? WHERE settingsid = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    res.json(result.insertId);
                });
    });
};

exports.delete = function (req, res) {
    var settings = req.body;
};