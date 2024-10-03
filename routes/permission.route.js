const permissionController = require('../controllers/permission.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"pengguna tambah",
	"pengguna lihat",
	"pengguna ubah",
	"pengguna hapus",
];

let prefix = '/permission';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], permissionController.getAll);
/* -- ROUTE -- */

module.exports = route;