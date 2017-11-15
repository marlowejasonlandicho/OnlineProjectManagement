var mysql = require('mysql'),
        config = require('./config'),
        async = require('async');

var PRODUCTION_DB = config.dbName,
        TEST_DB = config.dbName;

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

exports.READ = 'read';
exports.WRITE = 'write';

var state = {
    pool: null,
    mode: null
};

exports.connect = function (mode, done) {
    if (mode === exports.MODE_PRODUCTION) {
        state.pool = mysql.createPoolCluster();

        state.pool.add('WRITE', {
            host: config.db,
            user: config.dbUserName,
            password: config.dbPassword,
            database: PRODUCTION_DB
        });

        state.pool.add('READ', {
            host: config.db,
            user: config.dbUserName,
            password: config.dbPassword,
            database: PRODUCTION_DB
        });


    } else {
        state.pool = mysql.createPool({
            host: config.db,
            connectionLimit: config.dbConnectionLimit, //important
            user: config.dbUserName,
            password: config.dbPassword,
            database: TEST_DB
        });
    }

    state.mode = mode;
    done();
};


exports.get = function (type, done) {
    var pool = state.pool;
    if (!pool)
        return done(new Error('Missing database connection.'));

    if (type === exports.WRITE) {
        state.pool.getConnection(function (err, connection) {
            if (err)
                return done(err);
            done(null, connection);
        });
    } else {
        state.pool.getConnection(function (err, connection) {
            if (err)
                return done(err);
            done(null, connection);
        });
    }
};

exports.fixtures = function (data) {
    var pool = state.pool;
    if (!pool)
        return done(new Error('Missing database connection.'));

    var names = Object.keys(data.tables);

    async.each(names, function (name, cb) {
        async.each(data.tables[name], function (row, cb) {
            var keys = Object.keys(row)
                    , values = keys.map(function (key) {
                        return "'" + row[key] + "'";
                    });

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
        }, cb);
    }, done);
};

exports.drop = function (tables, done) {
    var pool = state.pool;
    if (!pool)
        return done(new Error('Missing database connection.'));

    async.each(tables, function (name, cb) {
        pool.query('DELETE * FROM ' + name, cb);
    }, done);
};

exports.releaseConnections = function () {
    console.log('Closing all connections...');
    state.pool.end();
    console.log('Connections closed.');
};