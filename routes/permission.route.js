const permissionController = require('../controllers/permission.controller');
const express = require('express');

const route = express.Router();

let prefix = '/permission';
/* -- ROUTE -- */
route.post(prefix + '/create', permissionController.create);
/* -- ROUTE -- */

module.exports = route;