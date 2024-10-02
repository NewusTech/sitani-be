const validasiKorluhPadiController = require('../controllers/validasiKorluhPadi.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph validasi korluh padi",
];

let prefix = '/validasi/korluh-padi';
/* -- ROUTE -- */
route.post(prefix + '/update/:id', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhPadiController.reqValidation);
route.post(prefix + '/set', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhPadiController.validate);
route.get(prefix + '/data', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhPadiController.data);
/* -- ROUTE -- */

module.exports = route;