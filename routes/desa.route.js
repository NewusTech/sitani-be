const desaController = require('../controllers/desa.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/desa';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkUserOrPass()], desaController.getAll);
route.get(prefix + '/get/:id', desaController.getOne);
/* -- ROUTE -- */

module.exports = route;
