const desaController = require('../controllers/desa.controller');
const express = require('express');

const route = express.Router();

let prefix = '/desa';
/* -- ROUTE -- */
route.get(prefix + '/get', desaController.getAll);
/* -- ROUTE -- */

module.exports = route;
