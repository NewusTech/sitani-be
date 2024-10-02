const validasiKorluhPalawijaController = require('../controllers/validasiKorluhPalawija.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph validasi korluh palawija",
];

let prefix = '/validasi/korluh-palawija';
/* -- ROUTE -- */
route.post(prefix + '/update/:id', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhPalawijaController.reqValidation);
route.post(prefix + '/set', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhPalawijaController.validate);
route.get(prefix + '/data', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhPalawijaController.data);
/* -- ROUTE -- */

module.exports = route;