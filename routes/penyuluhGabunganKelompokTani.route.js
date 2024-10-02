const penyuluhGabunganKelompokTaniController = require('../controllers/penyuluhGabunganKelompokTani.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"penyuluh gapoktan tambah",
	"penyuluh gapoktan lihat",
	"penyuluh gapoktan ubah",
	"penyuluh gapoktan hapus",
];

let prefix = '/penyuluh-gabungan-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], penyuluhGabunganKelompokTaniController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhGabunganKelompokTaniController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], penyuluhGabunganKelompokTaniController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], penyuluhGabunganKelompokTaniController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], penyuluhGabunganKelompokTaniController.delete);
/* -- ROUTE -- */

module.exports = route;
