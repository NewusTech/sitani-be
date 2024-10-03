const permissionController = require('../controllers/permission.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/permission';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkPermissionAndLogout([])], permissionController.getAll);
/* -- ROUTE -- */

module.exports = route;