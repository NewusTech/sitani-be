const pspAlsintanController = require('../controllers/pspAlsintan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

const allowPermissions = [
	"semua",
	"psp alsintan",
];

let prefix = '/psp/alsintan/';
/* -- ROUTE -- */
route.get(prefix + '/kecamatan', [mid.checkPermissionAndLogout(allowPermissions)], pspAlsintanController.getKecamatan);
/* -- ROUTE -- */

module.exports = route;
