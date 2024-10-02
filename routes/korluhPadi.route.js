const korluhPadiController = require('../controllers/korluhPadi.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"korluh padi tambah",
	"korluh padi lihat",
	"korluh padi ubah",
	"korluh padi hapus",
];

let prefix = '/korluh/padi';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], korluhPadiController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], korluhPadiController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], korluhPadiController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], korluhPadiController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], korluhPadiController.delete);
/* -- ROUTE -- */

module.exports = route;
