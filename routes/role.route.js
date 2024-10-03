const roleController = require('../controllers/role.controller');
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

let prefix = '/role';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], roleController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], roleController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], roleController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], roleController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], roleController.delete);
/* -- ROUTE -- */

module.exports = route;
