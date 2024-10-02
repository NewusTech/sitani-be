const penyuluhKelompokTaniController = require('../controllers/penyuluhKelompokTani.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"penyuluh poktan tambah",
	"penyuluh poktan lihat",
	"penyuluh poktan ubah",
	"penyuluh poktan hapus",
];

let prefix = '/penyuluh-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], penyuluhKelompokTaniController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhKelompokTaniController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhKelompokTaniController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], penyuluhKelompokTaniController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], penyuluhKelompokTaniController.delete);
/* -- ROUTE -- */

module.exports = route;
