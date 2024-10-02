const tphDashboardController = require('../controllers/tphDashboard.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",

	"tph realisasi padi tambah",
	"tph realisasi padi lihat",
	"tph realisasi padi ubah",
	"tph realisasi padi hapus",

	"tph realisasi palawija 1 tambah",
	"tph realisasi palawija 1 lihat",
	"tph realisasi palawija 1 ubah",
	"tph realisasi palawija 1 hapus",

	"tph realisasi palawija 2 tambah",
	"tph realisasi palawija 2 lihat",
	"tph realisasi palawija 2 ubah",
	"tph realisasi palawija 2 hapus",

	"tph lahan sawah tambah",
	"tph lahan sawah lihat",
	"tph lahan sawah ubah",
	"tph lahan sawah hapus",

	"tph lahan bukan sawah tambah",
	"tph lahan bukan sawah lihat",
	"tph lahan bukan sawah ubah",
	"tph lahan bukan sawah hapus",

	"tph validasi korluh padi",

	"tph validasi korluh palawija",

	"tph validasi korluh sayur buah",

	"tph validasi korluh tanaman biofarmaka",

	"tph validasi korluh tanaman hias",
];

let prefix = '/tph/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], tphDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
