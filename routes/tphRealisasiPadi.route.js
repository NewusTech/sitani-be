const tphRealisasiPadiController = require('../controllers/tphRealisasiPadi.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph realisasi padi tambah",
	"tph realisasi padi lihat",
	"tph realisasi padi ubah",
	"tph realisasi padi hapus",
];

let prefix = '/tph/realisasi-padi';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], tphRealisasiPadiController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], tphRealisasiPadiController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], tphRealisasiPadiController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], tphRealisasiPadiController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], tphRealisasiPadiController.delete);
/* -- ROUTE -- */

module.exports = route;
