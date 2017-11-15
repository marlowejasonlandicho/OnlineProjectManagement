var db = require('../../../config/db.js'),
        ldap = require('ldapjs');

exports.create = function (req, res, next) {
    var department = req.body;

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        var departmentName = '' + department.departmentName;
        var departmentHead = '' + department.departmentHead;

        connection.query(
                'INSERT INTO department (departmentName, departmentHead) VALUES(?,?)',
                [departmentName, departmentHead],
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    res.json(result.insertId);
                });
    });
};

exports.listADDepartments = function (req, res, next) {
    var client = ldap.createClient({url: 'ldap://svr-dc01'});
    client.on('error', function (err) {
        console.log('Unable to connect to AD...');
    });
    var opts = {
        filter: '(&(objectClass=top)(objectClass=organizationalUnit)(objectClass=department))',
        scope: 'sub',
        attributes: [
            'name'
        ]
    };
    client.bind('CN=AD Query,CN=OPM Accounts,DC=OPMMAKATI,DC=EDU', 'password', function (err) {});
    client.search('OU=Online Project Management,DC=OPMMAKATI,DC=EDU',
            opts,
            function (error, search) {
                console.log('Searching.....');
                search.on('searchEntry', function (entry) {
                    if (entry.object) {
                        console.log('entry: %j ' + JSON.stringify(entry.object));
                        db.get(db.READ, function (err, connection) {
                            if (err) {
                                res.json({message: err});
                            }
                            connection.query(
                                    'SELECT * FROM department WHERE departmentName = ?',
                                    [entry.object.name],
                                    function (err, departmentResult) {
                                        connection.release();
                                        if (err) {
                                            next(err);
                                        }
                                        if (departmentResult && departmentResult.length === 0) {
                                            db.get(db.WRITE, function (err, connection) {
                                                if (err) {
                                                    console.log('Department crreation dailed: ' + err);
                                                }
                                                connection.query(
                                                        'INSERT INTO department (departmentName, departmentHead) VALUES(?, ?)',
                                                        [entry.object.name, entry.object.name + ' Head'],
                                                        function (err, insertResult) {
                                                            connection.release();
                                                            if (err) {
                                                                console.log('Department creation failed: ' + err);
                                                            } else {
                                                                console.log('Inserted: ' + entry.object.name);
                                                            }
                                                        });
                                            });
                                        }
                                    });
                        });
                    }
                    client.unbind(function (error) {
                        if (error) {
                            console.error('error unbind: ' + error.message);
                        } else {
                            console.log('client disconnected');
                        }
                    });
                });
                search.on('end', function (result) {
                    console.log('done');
                });
                search.on('error', function (error) {
                    console.error('error: ' + error.message);
                    client.unbind(function (error) {
                        if (error) {
                            console.error('error unbind: ' + error.message);
                        } else {
                            console.log('client disconnected');
                        }
                    });
                });
                // don't do this here
                //client.unbind(function(error) {if(error){console.log(error.message);} else{console.log('client disconnected');}});
            });

    res.status(200).send({
        status: 'OK',
        message: 'Retrieving Departments. Kindly hit refresh buttton to view results'
    });
};

exports.list = function (req, res, next) {

    var query = 'SELECT * FROM department WHERE departmentid > 0';
    var values = [];

    if (req.query.departmentid) {
        query += ' AND departmentid = ?';
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
                    if (result.length > 0) {
                        res.json(result);
                    } else if (result.length === 0) {
                        res.json([]);
                    }
                });
    });
};

exports.read = function (req, res) {
    res.json(req.department);
};

exports.departmentByID = function (req, res, next, id) {
    var values = [id];
    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                'SELECT * FROM department WHERE departmentid = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        next(err);
                    }
                    if (result.length === 1) {
                        req.department = req.body;
                        next();
//                        res.json(result);
                    } else if (result.length === 0) {
                        next({success: false, message: 'No records found'});
                    }
                });
    });
};

exports.update = function (req, res) {
    var department = req.body;
    var values = [
        department.departmentName,
        department.departmentHead,
        department.departmentid
    ];

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        connection.query(
                'UPDATE department SET departmentName = ?, departmentHead = ? WHERE departmentid = ?',
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

exports.delete = function (req, res, next) {
    var departmentid = req.params.departmentid;
    var values = [
        departmentid
    ];

    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        connection.query(
                'DELETE FROM department WHERE departmentid = ?',
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