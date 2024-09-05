const korluhMasterSayurBuahRoute = require('./korluhMasterSayurBuah.route');
const penyuluhKabupatenRoute = require('./penyuluhKabupaten.route');
const penyuluhKecamatanRoute = require('./penyuluhKecamatan.route');
const pspPenerimaUppoRoute = require('./pspPenerimaUppo.route');
const korluhPalawijaRoute = require('./korluhPalawija.route');
const kepegawaianRoute = require('./kepegawaian.route');
const korluhPadiRoute = require('./korluhPadi.route');
const permissionRoute = require('./permission.route');
const pspBantuanRoute = require('./pspBantuan.route');
const kecamatanRoute = require('./kecamatan.route');
const pspPupukRoute = require('./pspPupuk.route');
const articleRoute = require('./article.route');
const galeriRoute = require('./galeri.route');
const authRoute = require('./auth.route');
const desaRoute = require('./desa.route');
const roleRoute = require('./role.route');
const seedRoute = require('./seed.route');
const userRoute = require('./user.route');

module.exports = function (app, urlApi) {
    app.use(urlApi, korluhMasterSayurBuahRoute);
    app.use(urlApi, penyuluhKabupatenRoute);
    app.use(urlApi, penyuluhKecamatanRoute);
    app.use(urlApi, pspPenerimaUppoRoute);
    app.use(urlApi, korluhPalawijaRoute);
    app.use(urlApi, kepegawaianRoute);
    app.use(urlApi, korluhPadiRoute);
    app.use(urlApi, permissionRoute);
    app.use(urlApi, pspBantuanRoute);
    app.use(urlApi, kecamatanRoute);
    app.use(urlApi, pspPupukRoute);
    app.use(urlApi, articleRoute);
    app.use(urlApi, galeriRoute);
    app.use(urlApi, authRoute);
    app.use(urlApi, desaRoute);
    app.use(urlApi, roleRoute);
    app.use(urlApi, seedRoute);
    app.use(urlApi, userRoute);
}