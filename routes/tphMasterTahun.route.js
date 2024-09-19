const tphMasterTahunController = require('../controllers/tphMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/realisasi-palawija-1', tphMasterTahunController.realisasiPalawija1);
route.get(prefix + '/lahan-bukan-sawah', tphMasterTahunController.lahanBukanSawah);
route.get(prefix + '/realisasi-padi', tphMasterTahunController.realisasiPadi);
route.get(prefix + '/lahan-sawah', tphMasterTahunController.lahanSawah);
/* -- ROUTE -- */

module.exports = route;
