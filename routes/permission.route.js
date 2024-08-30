const permissionController = require('../controllers/permission.controller');
const express = require('express');

const route = express.Router();

let prefix = '/permission';
/* -- ROUTE -- */
route.post(prefix + '/create', permissionController.create);
route.get(prefix + '/get', permissionController.getAll);
route.get(prefix + '/get/:id', permissionController.getOneById);
route.put(prefix + '/update/:id', permissionController.update);
route.delete(prefix + '/delete/:id', permissionController.delete);
/* -- ROUTE -- */

module.exports = route;