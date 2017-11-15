var config = require('./config'),
        express = require('express'),
        morgan = require('morgan'),
        compress = require('compression'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        cookieParser = require('cookie-parser'),
        session = require('express-session'),
        passport = require('passport');

module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(session({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        expires: new Date(Date.now() + 60 * 10000),
        maxAge: 60 * 10000
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride());

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
//        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//        res.setHeader('Expires', '-1');
//        res.setHeader('Pragma', 'no-cache');
        next();
    });

    app.use(express.static('./public'));

    require('../app/routes/department.server.routes.js')(app);
    require('../app/routes/task.server.routes.js')(app);
    require('../app/routes/status.server.routes.js')(app);
    require('../app/routes/settings.server.routes')(app);
    require('../app/routes/email.server.routes')(app);
    require('../app/routes/user.server.routes')(app);
    require('../app/routes/angular.routes')(app);
    require('../app/routes/authentication.server.routes')(app);

    return app;
};