var db = require('../../config/db.js'),
        config = require('../../config/config.js'),
        passport = require('passport');
var jwt = require('jsonwebtoken');

exports.authenticateADUser = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        console.log(error);
        if (error) {
            console.log('to send error');
            return res.json(error);
        }
        if (!user && !error) {
            return  res.json(error);
        }

        if (user) {
            var token = jwt.sign({
                id: user.username
            }, config.sessionSecret
//                    {expiresIn: 120}
            );
            user.token = token;
            res.json(user);
        }
    })(req, res, next);
};

exports.authenticateLDAPUser = function (req, res, next) {
    passport.authenticate('ldapauth', function (err, user, info) {
        var error = err || info;
        if (error)
            return res.json(401, error);
        if (!user)
            return res.json(404, {message: 'Something went wrong, please try again.'});
//            var token = auth.signToken(user._id, user.role);
        res.json(user);
    })(req, res, next);
};

exports.authenticate = function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var values = [username, password];

    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                'SELECT * FROM user WHERE  username = ?',
                values,
                function (err, result) {
                    connection.release();
                    if (err) {
                        res.json({message: err});
                    }
                    if (result.length === 1) {
                        res.json(
                                {
                                    success: true,
                                    id: result.username,
                                    firstname: result.firstname,
                                    lastname: result.lastname,
                                    username: result.username,
                                    email: result.email,
                                    departmentid: result.departmentid,
                                    roleid: result.roleid
                                }
                        );
                    } else if (result.length === 0) {
                        res.json({success: false, message: 'Invalid User'});
                    }
                });
    });
};