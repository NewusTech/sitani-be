const roleController = require('../controllers/role.controller');
const express = require('express');

const route = express.Router();

let prefix = '/role';
/* -- ROUTE -- */
route.post(prefix + '/create', roleController.create);
route.get(prefix + '/get', roleController.getAll);
route.get(prefix + '/get/:id', roleController.getOneById);
route.put(prefix + '/update/:id', roleController.update);
route.delete(prefix + '/delete/:id', roleController.delete);
/* -- ROUTE -- */

module.exports = route;
