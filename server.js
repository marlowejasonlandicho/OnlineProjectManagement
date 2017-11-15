process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('./config/express'),
        passport = require('./config/passport'),
        db = require('./config/db');

var passport = passport();

// Connect to MySQL on start
db.connect(db.MODE_TEST, function (err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    } else {

    }
});

var app = express();

app.listen(3000, function () {
    console.log('Server running at http://127.0.0.1:3000/');
});

module.exports = app;

process.on('SIGTERM', function () {
    db.releaseConnections();
    process.exit(1);
});

process.on('SIGINT', function () {
    db.releaseConnections();
    process.exit(1);
});

process.on('SIGHUP', function () {
    db.releaseConnections();
    process.exit(1);
});
