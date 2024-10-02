const tphRealisasiPalawija1Controller = require('../controllers/tphRealisasiPalawija1.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph realisasi palawija 1 tambah",
	"tph realisasi palawija 1 lihat",
	"tph realisasi palawija 1 ubah",
	"tph realisasi palawija 1 hapus",
];

let prefix = '/tph/realisasi-palawija-1';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], tphRealisasiPalawija1Controller.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], tphRealisasiPalawija1Controller.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], tphRealisasiPalawija1Controller.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], tphRealisasiPalawija1Controller.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], tphRealisasiPalawija1Controller.delete);
/* -- ROUTE -- */

module.exports = route;
