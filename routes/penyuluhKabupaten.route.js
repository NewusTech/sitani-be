const penyuluhKabupatenController = require('../controllers/penyuluhKabupaten.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"penyuluh kabupaten tambah",
	"penyuluh kabupaten lihat",
	"penyuluh kabupaten ubah",
	"penyuluh kabupaten hapus",
];

let prefix = '/penyuluh-kabupaten';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], penyuluhKabupatenController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhKabupatenController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhKabupatenController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], penyuluhKabupatenController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], penyuluhKabupatenController.delete);
/* -- ROUTE -- */

module.exports = route;
