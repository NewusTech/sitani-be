const penyuluhDashboardController = require('../controllers/penyuluhDashboard.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",

	"penyuluh kabupaten tambah",
	"penyuluh kabupaten lihat",
	"penyuluh kabupaten ubah",
	"penyuluh kabupaten hapus",

	"penyuluh kecamatan tambah",
	"penyuluh kecamatan lihat",
	"penyuluh kecamatan ubah",
	"penyuluh kecamatan hapus",

	"penyuluh gapoktan tambah",
	"penyuluh gapoktan lihat",
	"penyuluh gapoktan ubah",
	"penyuluh gapoktan hapus",

	"penyuluh poktan tambah",
	"penyuluh poktan lihat",
	"penyuluh poktan ubah",
	"penyuluh poktan hapus",
];

let prefix = '/penyuluh/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
