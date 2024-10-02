const tphLahanSawahController = require('../controllers/tphLahanSawah.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph lahan sawah tambah",
	"tph lahan sawah lihat",
	"tph lahan sawah ubah",
	"tph lahan sawah hapus",
];

let prefix = '/tph/lahan-sawah';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], tphLahanSawahController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], tphLahanSawahController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], tphLahanSawahController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], tphLahanSawahController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], tphLahanSawahController.delete);
/* -- ROUTE -- */

module.exports = route;
