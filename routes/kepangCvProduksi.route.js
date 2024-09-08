const kepangCvProduksiController = require('../controllers/kepangCvProduksi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/cv-produksi';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangCvProduksiController.create);
route.get(prefix + '/get', kepangCvProduksiController.getAll);
route.get(prefix + '/get/:id', kepangCvProduksiController.getOne);
/* -- ROUTE -- */

module.exports = route;
