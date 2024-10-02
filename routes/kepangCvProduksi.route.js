const kepangCvProduksiController = require('../controllers/kepangCvProduksi.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"kepang cv produksi tambah",
	"kepang cv produksi lihat",
	"kepang cv produksi ubah",
	"kepang cv produksi hapus",
];

let prefix = '/kepang/cv-produksi';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], kepangCvProduksiController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], kepangCvProduksiController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], kepangCvProduksiController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], kepangCvProduksiController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], kepangCvProduksiController.delete);
/* -- ROUTE -- */

module.exports = route;
