const korluhTanamanHiasController = require('../controllers/korluhTanamanHias.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"korluh tanaman hias tambah",
	"korluh tanaman hias lihat",
	"korluh tanaman hias ubah",
	"korluh tanaman hias hapus",
];

let prefix = '/korluh/tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], korluhTanamanHiasController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], korluhTanamanHiasController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], korluhTanamanHiasController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], korluhTanamanHiasController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], korluhTanamanHiasController.delete);
/* -- ROUTE -- */

module.exports = route;
