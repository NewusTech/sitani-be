const authRoute = require('./auth.route');
const userRoute = require('./user.route');

module.exports = function (app, urlApi) {
    app.use(urlApi, authRoute);
    app.use(urlApi, userRoute);
}