const perkebunanMasterKategoriKomoditasController = require('../controllers/perkebunanMasterKategoriKomoditas.controller');
const express = require('express');

const route = express.Router();

let prefix = '/perkebunan/master-kategori';
/* -- ROUTE -- */
route.get(prefix + '/get', perkebunanMasterKategoriKomoditasController.getAll);
/* -- ROUTE -- */

module.exports = route;
