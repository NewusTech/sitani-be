const pspAlsintanPrapanenController = require('../controllers/pspAlsintanPrapanen.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"psp alsintan prapanen tambah",
	"psp alsintan prapanen lihat",
	"psp alsintan prapanen ubah",
	"psp alsintan prapanen hapus",
];

let prefix = '/psp/alsintan-prapanen';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], pspAlsintanPrapanenController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], pspAlsintanPrapanenController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], pspAlsintanPrapanenController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], pspAlsintanPrapanenController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], pspAlsintanPrapanenController.delete);
/* -- ROUTE -- */

module.exports = route;
