const perkebunanKecamatanController = require('../controllers/perkebunanKecamatan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"perkebunan kecamatan tambah",
	"perkebunan kecamatan lihat",
	"perkebunan kecamatan ubah",
	"perkebunan kecamatan hapus",
];

let prefix = '/perkebunan/kecamatan';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], perkebunanKecamatanController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], perkebunanKecamatanController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], perkebunanKecamatanController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], perkebunanKecamatanController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], perkebunanKecamatanController.delete);
/* -- ROUTE -- */

module.exports = route;
