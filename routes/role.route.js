const roleController = require('../controllers/role.controller');
const express = require('express');

const route = express.Router();

let prefix = '/role';
/* -- ROUTE -- */
route.post(prefix + '/create', roleController.create);
route.get(prefix + '/get', roleController.getAll);
route.get(prefix + '/get/:id', roleController.getOneById);
/* -- ROUTE -- */

module.exports = route;
