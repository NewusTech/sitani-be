const korluhSayurBuahController = require('../controllers/korluhSayurBuah.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"korluh sayur buah tambah",
	"korluh sayur buah lihat",
	"korluh sayur buah ubah",
	"korluh sayur buah hapus",
];

let prefix = '/korluh/sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], korluhSayurBuahController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], korluhSayurBuahController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], korluhSayurBuahController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], korluhSayurBuahController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], korluhSayurBuahController.delete);
/* -- ROUTE -- */

module.exports = route;
