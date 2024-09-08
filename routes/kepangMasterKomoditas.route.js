const kepangMasterKomoditasController = require('../controllers/kepangMasterKomoditas.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/master-komoditas';
/* -- ROUTE -- */
route.get(prefix + '/get', kepangMasterKomoditasController.getAll);
/* -- ROUTE -- */

module.exports = route;
