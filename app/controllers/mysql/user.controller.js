var db = require('../../../config/db.js'),
        ldap = require('ldapjs'),
        config = require('../../../config/config.js'),
        async = require('async');

exports.list = function (req, res, next) {
    var query = 'SELECT u.userid, u.firstname, u.lastname, concat(u.firstname, \' \' , u.lastname) as fullname, u.email, u.username, u.departmentid, r.roleid, r.rolename ' +
            'FROM user u, role r ' +
            'WHERE u.roleid = r.roleid';
    var values = [];
    if (req.query.departmentid) {
        query += ' AND u.departmentid = ? ';
        values.push(req.query.departmentid);
    }
    if (req.query.username) {
        query += ' AND u.username = ? ';
        values.push(req.query.username);
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

exports.listADUsers = function (req, res, next) {
    var departments = [];
    var resultArray = [];

    async.series([
        function (callback)
        {
            db.get(db.READ,
                    function (err, connection) {
                        if (err) {
                            console.log('Error: ' + err);
                        }
                        connection.query(
                                'SELECT * FROM department',
                                [],
                                function (err, departmentResult) {
                                    connection.release();
                                    departments = departmentResult;
                                    callback();

                                }
                        );
                    });
        },
        function (callback)
        {
            departments.forEach(function (department, index) {

                var client = ldap.createClient({url: config.adurl});
                client.on('error', function (err) {
                    console.log('Unable to connect to AD...');
                });
                var opts = {
                    filter: '(&(objectClass=person)(objectClass=organizationalPerson)(objectClass=user)(department=' + department.departmentName + ')(mail=*@opm.opm)(!(=)))',
                    paged: true,
                    sizeLimit: 500,
                    scope: 'sub',
                    attributes: [
                        'dn',
                        'sn',
                        'sAMAccountName',
                        'name',
                        'userPrincipalName',
                        'cn',
                        'mail',
                        'department',
                        'givenName'
                    ]
                };

                client.bind(config.adbinddn, config.adbindcredentials, function (err) {});
                client.search('OU=OPM,DC=OPMMAKATI,DC=EDU', opts,
                        function (error, search) {
                            console.log('Searching.....');
                            search.on('searchEntry', function (entry) {
                                resultArray.push(entry.object);
                            });
                            search.on('page', function (result, cb) {
                                console.log('paged');
                                if (cb) {
                                    cb.call();
                                } else {

                                    resultArray.forEach(function (entryObject, index) {
                                        var firstname = '' + entryObject.givenName;
                                        var lastname = '' + entryObject.sn;
                                        var email = '' + entryObject.mail;
                                        var username = '' + entryObject.sAMAccountName;
                                        var departmentName = entryObject.department;

                                        console.log('username: ' + username + ', departmentName: ' + departmentName);
                                        if (!(entryObject.mail === undefined &&
                                                entryObject.sAMAccountName === undefined)
                                                ||
                                                !(entryObject.mail === 'undefined' &&
                                                        entryObject.sAMAccountName === 'undefined')) {

                                            var departmentid = departmentid = department.departmentid;

                                            db.get(db.WRITE, function (err, connection) {
                                                if (err) {
                                                    console.log('Error' + err);
                                                }
                                                connection.query(
                                                        'INSERT INTO user (firstname,lastname,email,username,departmentid,hashedPassword,roleid)' +
                                                        'VALUES (?,?,?,?,?,?,?)',
                                                        [
                                                            firstname,
                                                            lastname,
                                                            email,
                                                            username,
                                                            departmentid,
                                                            ' ',
                                                            2
                                                        ],
                                                        function (err, insertResult) {
                                                            if (err) {
                                                                console.log('User creation failed: ' + err);
                                                                connection.release();
                                                            } else {
                                                                console.log('Inserted: ' + email);
                                                                connection.release();
                                                            }
                                                        });
                                            });
                                        }
                                    });
                                    resultArray = [];
                                }
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
                        });
            });
            callback();

        }]);
    res.status(200).send({
        status: 'OK',
        message: 'Retrieving Users. Kindly hit refresh buttton to view results'
    });
};
exports.read = function (req, res, next) {
    res.json(req.user);
};
exports.userByName = function (req, res, next, id) {
    var username = req.params.userName;
    var values = [username];
    db.get(db.READ, function (err, connection) {
        if (err) {
            next({message: err});
        }
        connection.query(
                'SELECT u.userid, u.firstname, u.lastname, concat(u.lastname, \', \' , u.firstname) as fullname, u.email, u.username, u.departmentid, r.rolename ' +
                'FROM user u, role r ' +
                'WHERE u.roleid = r.roleid and u.username = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        next({message: err});
                    }
                    if (result.length === 1) {
                        req.user = {
                            success: true,
                            user: {
                                userid: result[0].userid,
                                firstname: result[0].firstname,
                                lastname: result[0].lastname,
                                fullname: result[0].fullname,
                                username: result[0].username,
                                email: result[0].email,
                                departmentid: result[0].departmentid,
                                rolename: result[0].rolename
                            }
                        };
                        next();
                    } else if (result.length === 0) {
                        next({success: false, message: 'Invalid User'});
                    }
                });
    });
};
exports.userById = function (req, res, next) {
    req.user = req.body;
    next();
};
exports.update = function (req, res) {
    var userId = req.params.userId;
    var user = req.body;
    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        connection.query(
                'UPDATE user SET departmentid = ?, roleid = ? WHERE userid = ?',
                [user.departmentid, user.roleid, userId],
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
    var userId = req.params.userId;
    var values = [
        userId
    ];
    db.get(db.WRITE, function (err, connection) {
        if (err) {
            res.json({message: err});
        }

        connection.query(
                'DELETE FROM user WHERE userid = ?',
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