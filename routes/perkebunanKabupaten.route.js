const perkebunanKabupatenController = require('../controllers/perkebunanKabupaten.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"perkebunan kabupaten",
];

let prefix = '/perkebunan/kabupaten';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout(allowPermissions)], perkebunanKabupatenController.getAll);
/* -- ROUTE -- */

module.exports = route;
