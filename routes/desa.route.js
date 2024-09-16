const desaController = require('../controllers/desa.controller');
const express = require('express');

const route = express.Router();

let prefix = '/desa';
/* -- ROUTE -- */
route.get(prefix + '/get', desaController.getAll);
route.get(prefix + '/get/:id', desaController.getOne);
/* -- ROUTE -- */

module.exports = route;
