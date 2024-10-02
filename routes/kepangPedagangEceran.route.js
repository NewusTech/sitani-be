const kepangPedagangEceranController = require('../controllers/kepangPedagangEceran.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"kepang pedagang eceran tambah",
	"kepang pedagang eceran lihat",
	"kepang pedagang eceran ubah",
	"kepang pedagang eceran hapus",
];

let prefix = '/kepang/pedagang-eceran';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], kepangPedagangEceranController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], kepangPedagangEceranController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], kepangPedagangEceranController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], kepangPedagangEceranController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], kepangPedagangEceranController.delete);
/* -- ROUTE -- */

module.exports = route;
