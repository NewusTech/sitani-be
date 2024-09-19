const kepangMasterTahunController = require('../controllers/kepangMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/perbandingan-harga', kepangMasterTahunController.perbandinganHarga);
/* -- ROUTE -- */

module.exports = route;
