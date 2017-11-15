var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        db = require('../../config/db.js');

module.exports = function () {
    passport.use(new LocalStrategy(
            function (userName, password, done) {
                var values = [userName, password];
                db.get(db.READ,
                        function (err, connection) {
                            if (err) {
                                return done({message: err});
                            }
                            connection.query(
                                    'SELECT * FROM user WHERE  username = ? AND hashedPassword = ?',
                                    values,
                                    function (err, result) {
                                        if (err) {
                                            return done(null, false, {message: err});
                                        }
                                        if (result.length === 1) {
                                            return done(null,
                                                    {
                                                        success: true,
                                                        id: result[0].email,
                                                        firstname: result[0].firstname,
                                                        lastname: result[0].lastname,
                                                        username: result[0].username,
                                                        email: result[0].email,
                                                        departmentid: result[0].departmentid,
                                                        roleid: result[0].roleid
                                                    }
                                            );
                                        } else if (result.length === 0) {
                                            return done(null, false, {success: false, message: 'Invalid User'});
                                        }
                                    });
                        }
                );
            }
    ));
};