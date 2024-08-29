const permissionController = require('../controllers/permission.controller');
const express = require('express');

const route = express.Router();

let prefix = '/permission';
/* -- ROUTE -- */
route.post(prefix + '/create', permissionController.create);
route.get(prefix + '/get', permissionController.getAll);
/* -- ROUTE -- */

module.exports = route;