const korluhStatusLaporanController = require('../controllers/korluhStatusLaporan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",

	"korluh padi tambah",
	"korluh padi lihat",
	"korluh padi ubah",
	"korluh padi hapus",

	"korluh palawija tambah",
	"korluh palawija lihat",
	"korluh palawija ubah",
	"korluh palawija hapus",

	"korluh sayur buah tambah",
	"korluh sayur buah lihat",
	"korluh sayur buah ubah",
	"korluh sayur buah hapus",

	"korluh tanaman biofarmaka tambah",
	"korluh tanaman biofarmaka lihat",
	"korluh tanaman biofarmaka ubah",
	"korluh tanaman biofarmaka hapus",

	"korluh tanaman hias tambah",
	"korluh tanaman hias lihat",
	"korluh tanaman hias ubah",
	"korluh tanaman hias hapus",
];

let prefix = '/status-laporan';
/* -- ROUTE -- */
route.get(prefix + '/hias', [mid.checkPermissionAndLogout(allowPermissions)], korluhStatusLaporanController.statusHias);
route.get(prefix + '/padi', [mid.checkPermissionAndLogout(allowPermissions)], korluhStatusLaporanController.statusPadi);
route.get(prefix + '/palawija', [mid.checkPermissionAndLogout(allowPermissions)], korluhStatusLaporanController.statusPalawija);
route.get(prefix + '/sayur-buah', [mid.checkPermissionAndLogout(allowPermissions)], korluhStatusLaporanController.statusSayurBuah);
route.get(prefix + '/biofarmaka', [mid.checkPermissionAndLogout(allowPermissions)], korluhStatusLaporanController.statusBiofarmaka);
/* -- ROUTE -- */

module.exports = route;
