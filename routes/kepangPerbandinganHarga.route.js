const kepangPerbandinganHargaController = require('../controllers/kepangPerbandinganHarga.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"kepang perbandingan harga",
];

let prefix = '/kepang/perbandingan-harga';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], kepangPerbandinganHargaController.getAll);
/* -- ROUTE -- */

module.exports = route;
