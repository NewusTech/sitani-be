const userRoute = require('./user.route');

module.exports = function (app, urlApi) {
    app.use(urlApi, userRoute);
}