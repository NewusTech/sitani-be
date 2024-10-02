const pspPupukController = require('../controllers/pspPupuk.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"psp pupuk tambah",
	"psp pupuk lihat",
	"psp pupuk ubah",
	"psp pupuk hapus",
];

let prefix = '/psp/pupuk';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], pspPupukController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], pspPupukController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], pspPupukController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], pspPupukController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], pspPupukController.delete);
/* -- ROUTE -- */

module.exports = route;
