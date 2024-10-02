const validasiKorluhSayurBuahController = require('../controllers/validasiKorluhSayurBuah.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph validasi korluh sayur buah",
];

let prefix = '/validasi/korluh-sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/update/:id', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhSayurBuahController.reqValidation);
route.post(prefix + '/set', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhSayurBuahController.validate);
route.get(prefix + '/data', [mid.checkPermissionAndLogout(allowPermissions)], validasiKorluhSayurBuahController.data);
/* -- ROUTE -- */

module.exports = route;