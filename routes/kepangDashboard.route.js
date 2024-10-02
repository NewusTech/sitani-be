const kepangDashboardController = require('../controllers/kepangDashboard.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",

	"kepang perbandingan harga",

	"kepang cv produksi tambah",
	"kepang cv produksi lihat",
	"kepang cv produksi ubah",
	"kepang cv produksi hapus",

	"kepang cv produsen tambah",
	"kepang cv produsen lihat",
	"kepang cv produsen ubah",
	"kepang cv produsen hapus",

	"kepang pedagang eceran tambah",
	"kepang pedagang eceran lihat",
	"kepang pedagang eceran ubah",
	"kepang pedagang eceran hapus",

	"kepang produsen eceran tambah",
	"kepang produsen eceran lihat",
	"kepang produsen eceran ubah",
	"kepang produsen eceran hapus",
];

let prefix = '/kepang/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], kepangDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
