const kepangPerbandinganHargaController = require('../controllers/kepangPerbandinganHarga.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/perbandingan-harga';
/* -- ROUTE -- */
route.get(prefix + '/get', kepangPerbandinganHargaController.getAll);
/* -- ROUTE -- */

module.exports = route;
