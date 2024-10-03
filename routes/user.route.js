const userController = require('../controllers/user.controller');
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

let prefix = '/user';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], userController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], userController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], userController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], userController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], userController.delete);
/* -- ROUTE -- */

module.exports = route;