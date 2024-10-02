const pspDashboardController = require('../controllers/pspDashboard.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",

	"psp alsintan",

	"psp alsintan prapanen tambah",
	"psp alsintan prapanen lihat",
	"psp alsintan prapanen ubah",
	"psp alsintan prapanen hapus",

	"psp alsintan pascapanen tambah",
	"psp alsintan pascapanen lihat",
	"psp alsintan pascapanen ubah",
	"psp alsintan pascapanen hapus",

	"psp uppo tambah",
	"psp uppo lihat",
	"psp uppo ubah",
	"psp uppo hapus",

	"psp pupuk tambah",
	"psp pupuk lihat",
	"psp pupuk ubah",
	"psp pupuk hapus",

	"psp bantuan tambah",
	"psp bantuan lihat",
	"psp bantuan ubah",
	"psp bantuan hapus",
];

let prefix = '/psp/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], pspDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
