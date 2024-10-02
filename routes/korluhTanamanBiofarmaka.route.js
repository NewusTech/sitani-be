const korluhTanamanBiofarmakaController = require('../controllers/korluhTanamanBiofarmaka.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"korluh tanaman biofarmaka tambah",
	"korluh tanaman biofarmaka lihat",
	"korluh tanaman biofarmaka ubah",
	"korluh tanaman biofarmaka hapus",
];

let prefix = '/korluh/tanaman-biofarmaka';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], korluhTanamanBiofarmakaController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], korluhTanamanBiofarmakaController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], korluhTanamanBiofarmakaController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], korluhTanamanBiofarmakaController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], korluhTanamanBiofarmakaController.delete);
/* -- ROUTE -- */

module.exports = route;
