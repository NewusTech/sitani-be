const kepangMasterTahunController = require('../controllers/kepangMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/perbandingan-harga', kepangMasterTahunController.perbandinganHarga);
route.get(prefix + '/produsen-eceran', kepangMasterTahunController.produsenEceran);
route.get(prefix + '/cv-produksi', kepangMasterTahunController.cvProduksi);
route.get(prefix + '/cv-produsen', kepangMasterTahunController.cvProdusen);
/* -- ROUTE -- */

module.exports = route;
