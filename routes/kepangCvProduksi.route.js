const kepangCvProduksiController = require('../controllers/kepangCvProduksi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/cv-produksi';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangCvProduksiController.create);
/* -- ROUTE -- */

module.exports = route;
