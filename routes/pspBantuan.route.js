const pspBantuanController = require('../controllers/pspBantuan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"psp bantuan tambah",
	"psp bantuan lihat",
	"psp bantuan ubah",
	"psp bantuan hapus",
];

let prefix = '/psp/bantuan';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], pspBantuanController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], pspBantuanController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], pspBantuanController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], pspBantuanController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], pspBantuanController.delete);
/* -- ROUTE -- */

module.exports = route;
