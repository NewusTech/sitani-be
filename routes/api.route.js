const permissionRoute = require('./permission.route');
const authRoute = require('./auth.route');
const roleRoute = require('./role.route');
const userRoute = require('./user.route');

module.exports = function (app, urlApi) {
    app.use(urlApi, permissionRoute);
    app.use(urlApi, authRoute);
    app.use(urlApi, roleRoute);
    app.use(urlApi, userRoute);
}