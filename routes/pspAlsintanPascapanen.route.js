const pspAlsintanPascapanenController = require('../controllers/pspAlsintanPascapanen.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"psp alsintan pascapanen tambah",
	"psp alsintan pascapanen lihat",
	"psp alsintan pascapanen ubah",
	"psp alsintan pascapanen hapus",
];

let prefix = '/psp/alsintan-pascapanen';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], pspAlsintanPascapanenController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], pspAlsintanPascapanenController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], pspAlsintanPascapanenController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], pspAlsintanPascapanenController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], pspAlsintanPascapanenController.delete);
/* -- ROUTE -- */

module.exports = route;
