const articleController = require('../controllers/article.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');
const multer = require('multer');

const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowPermissions = [
	"semua",
	"berita tambah",
	"berita lihat",
	"berita ubah",
	"berita hapus",
];

let prefix = '/article';
/* -- ROUTE -- */
route.post(prefix + '/create', [mid.checkPermissionAndLogout([allowPermissions.slice(0, 2)])], upload.fields([{ name: 'image', maxCount: 1 }]), articleController.create);
route.get(prefix + '/get', articleController.getAll);
route.get(prefix + '/get/:slug', articleController.getOneBySlug);
route.put(prefix + '/update/:slug', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[3]])], upload.fields([{ name: 'image', maxCount: 1 }]), articleController.update);
route.delete(prefix + '/delete/:slug', [mid.checkPermissionAndLogout([allowPermissions[0], allowPermissions[4]])], articleController.delete);
/* -- ROUTE -- */

module.exports = route;
