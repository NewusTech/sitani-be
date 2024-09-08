const kepangPerbandinganHargaController = require('../controllers/kepangPerbandinganHarga.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/perbandingan-harga';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangPerbandinganHargaController.create);
route.get(prefix + '/get', kepangPerbandinganHargaController.getAll);
route.get(prefix + '/get/:id', kepangPerbandinganHargaController.getOne);
route.put(prefix + '/update/:id', kepangPerbandinganHargaController.update);
route.delete(prefix + '/delete/:id', kepangPerbandinganHargaController.delete);
/* -- ROUTE -- */

module.exports = route;
