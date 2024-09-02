const permissionRoute = require('./permission.route');
const articleRoute = require('./article.route');
const galeriRoute = require('./galeri.route');
const authRoute = require('./auth.route');
const roleRoute = require('./role.route');
const userRoute = require('./user.route');
const kepegawaianRoute = require('./kepegawaian.route');

module.exports = function (app, urlApi) {
    app.use(urlApi, permissionRoute);
    app.use(urlApi, articleRoute);
    app.use(urlApi, galeriRoute);
    app.use(urlApi, authRoute);
    app.use(urlApi, roleRoute);
    app.use(urlApi, userRoute);
    app.use(urlApi, kepegawaianRoute);
}