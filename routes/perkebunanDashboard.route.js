const perkebunanDashboardController = require('../controllers/perkebunanDashboard.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",

	"perkebunan kabupaten",

	"perkebunan kecamatan tambah",
	"perkebunan kecamatan lihat",
	"perkebunan kecamatan ubah",
	"perkebunan kecamatan hapus",
];

let prefix = '/perkebunan/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], perkebunanDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
