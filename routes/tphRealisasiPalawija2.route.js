const tphRealisasiPalawija2Controller = require('../controllers/tphRealisasiPalawija2.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph realisasi palawija 2 tambah",
	"tph realisasi palawija 2 lihat",
	"tph realisasi palawija 2 ubah",
	"tph realisasi palawija 2 hapus",
];

let prefix = '/tph/realisasi-palawija-2';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], tphRealisasiPalawija2Controller.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], tphRealisasiPalawija2Controller.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], tphRealisasiPalawija2Controller.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], tphRealisasiPalawija2Controller.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], tphRealisasiPalawija2Controller.delete);
/* -- ROUTE -- */

module.exports = route;
