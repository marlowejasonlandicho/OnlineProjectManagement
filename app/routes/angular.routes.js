module.exports = function (app) {
    app.get('/login', function (req, res) {
        res.sendfile('./public/views/login.html');
    });
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            // cannot access session here
        });
        res.sendfile('./public/views/login.html');
    });
    app.get('/main', function (req, res) {
        res.sendfile('./public/views/main.html');
    });
    app.get('/quickStatusUpdate', function (req, res) {
        res.sendfile('./public/views/quickStatusUpdate.html');
    });
};