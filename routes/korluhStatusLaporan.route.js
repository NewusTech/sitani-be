const korluhStatusLaporanController = require('../controllers/korluhStatusLaporan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/status-laporan';
/* -- ROUTE -- */
route.get(prefix + '/hias', [mid.checkUserOrPass()], korluhStatusLaporanController.statusHias);
route.get(prefix + '/padi', [mid.checkUserOrPass()], korluhStatusLaporanController.statusPadi);
route.get(prefix + '/palawija', [mid.checkUserOrPass()], korluhStatusLaporanController.statusPalawija);
route.get(prefix + '/sayur-buah', [mid.checkUserOrPass()], korluhStatusLaporanController.statusSayurBuah);
route.get(prefix + '/biofarmaka', [mid.checkUserOrPass()], korluhStatusLaporanController.statusBiofarmaka);
/* -- ROUTE -- */

module.exports = route;
