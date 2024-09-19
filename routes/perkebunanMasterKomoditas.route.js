const perkebunanMasterKomoditasController = require('../controllers/perkebunanMasterKomoditas.controller');
const express = require('express');

const route = express.Router();

let prefix = '/perkebunan/master-komoditas';
/* -- ROUTE -- */
route.get(prefix + '/get', perkebunanMasterKomoditasController.getAll);
/* -- ROUTE -- */

module.exports = route;
