const galeriController = require('../controllers/galeri.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');
const multer = require('multer');

const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowPermissions = [
	"semua",
	"galeri tambah",
	"galeri lihat",
	"galeri ubah",
	"galeri hapus",
];

let prefix = '/galeri';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout(allowPermissions.slice(0, 2))], upload.fields([{ name: 'image', maxCount: 1 }]), galeriController.create);
route.get(prefix + '/get', galeriController.getAll);
route.get(prefix + '/get/:id', galeriController.getOneById);
route.put(prefix + '/update/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], upload.fields([{ name: 'image', maxCount: 1 }]), galeriController.update);
route.delete(prefix + '/delete/:id', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], galeriController.delete);
/* -- ROUTE -- */

module.exports = route;
