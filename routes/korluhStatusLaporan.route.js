const korluhStatusLaporanController = require('../controllers/korluhStatusLaporan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/status-laporan';
/* -- ROUTE -- */
route.get(prefix + '/padi', [mid.checkUserOrPass()], korluhStatusLaporanController.statusPadi);
route.get(prefix + '/palawija', [mid.checkUserOrPass()], korluhStatusLaporanController.statusPalawija);
/* -- ROUTE -- */

module.exports = route;
