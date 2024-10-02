const tphLahanBukanSawahController = require('../controllers/tphLahanBukanSawah.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"tph lahan bukan sawah tambah",
	"tph lahan bukan sawah lihat",
	"tph lahan bukan sawah ubah",
	"tph lahan bukan sawah hapus",
];

let prefix = '/tph/lahan-bukan-sawah';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], tphLahanBukanSawahController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], tphLahanBukanSawahController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], tphLahanBukanSawahController.getOne);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], tphLahanBukanSawahController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], tphLahanBukanSawahController.delete);
/* -- ROUTE -- */

module.exports = route;
