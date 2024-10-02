const validasiKorluhTanamanHiasController = require('../controllers/validasiKorluhTanamanHias.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph validasi korluh tanaman hias",
];

let prefix = '/validasi/korluh-tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/update/:id', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhTanamanHiasController.reqValidation);
route.post(prefix + '/set', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhTanamanHiasController.validate);
route.get(prefix + '/data', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhTanamanHiasController.data);
/* -- ROUTE -- */

module.exports = route;