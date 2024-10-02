const korluhDashboardController = require('../controllers/korluhDashboard.controller');
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

let prefix = '/korluh/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], korluhDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
