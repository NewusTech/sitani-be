const roleController = require('../controllers/role.controller');
const express = require('express');

const route = express.Router();

let prefix = '/role';
/* -- ROUTE -- */
route.post(prefix + '/create', roleController.create);
/* -- ROUTE -- */

module.exports = route;
