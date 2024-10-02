const korluhPalawijaController = require('../controllers/korluhPalawija.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"korluh palawija tambah",
	"korluh palawija lihat",
	"korluh palawija ubah",
	"korluh palawija hapus",
];

let prefix = '/korluh/palawija';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], korluhPalawijaController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], korluhPalawijaController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], korluhPalawijaController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], korluhPalawijaController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], korluhPalawijaController.delete);
/* -- ROUTE -- */

module.exports = route;
