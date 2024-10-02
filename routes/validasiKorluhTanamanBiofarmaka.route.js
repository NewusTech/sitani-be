const validasiKorluhTanamanBiofarmakaController = require('../controllers/validasiKorluhTanamanBiofarmaka.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph validasi korluh tanaman biofarmaka",
];

let prefix = '/validasi/korluh-tanaman-biofarmaka';
/* -- ROUTE -- */
route.post(prefix + '/update/:id', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhTanamanBiofarmakaController.reqValidation);
route.post(prefix + '/set', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhTanamanBiofarmakaController.validate);
route.get(prefix + '/data', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhTanamanBiofarmakaController.data);
/* -- ROUTE -- */

module.exports = route;