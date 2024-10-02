const kepangProdusenEceranController = require('../controllers/kepangProdusenEceran.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"kepang produsen eceran tambah",
	"kepang produsen eceran lihat",
	"kepang produsen eceran ubah",
	"kepang produsen eceran hapus",
];

let prefix = '/kepang/produsen-eceran';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], kepangProdusenEceranController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], kepangProdusenEceranController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], kepangProdusenEceranController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], kepangProdusenEceranController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], kepangProdusenEceranController.delete);
/* -- ROUTE -- */

module.exports = route;
