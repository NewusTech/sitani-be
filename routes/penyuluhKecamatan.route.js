const penyuluhKecamatanController = require('../controllers/penyuluhKecamatan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"penyuluh kecamatan tambah",
	"penyuluh kecamatan lihat",
	"penyuluh kecamatan ubah",
	"penyuluh kecamatan hapus",
];

let prefix = '/penyuluh-kecamatan';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], penyuluhKecamatanController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhKecamatanController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhKecamatanController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], penyuluhKecamatanController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], penyuluhKecamatanController.delete);
/* -- ROUTE -- */

module.exports = route;
