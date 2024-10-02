const pspPenerimaUppoController = require('../controllers/pspPenerimaUppo.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"psp uppo tambah",
	"psp uppo lihat",
	"psp uppo ubah",
	"psp uppo hapus",
];

let prefix = '/psp/penerima-uppo';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], pspPenerimaUppoController.create);
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], pspPenerimaUppoController.getAll);
route.get(prefix + '/get/:id', [mid.checkPermissionAndLogout(allowPermissions)], pspPenerimaUppoController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], pspPenerimaUppoController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], pspPenerimaUppoController.delete);
/* -- ROUTE -- */

module.exports = route;
