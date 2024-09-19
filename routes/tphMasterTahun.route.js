const tphMasterTahunController = require('../controllers/tphMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/lahan-bukan-sawah', tphMasterTahunController.lahanBukanSawah);
route.get(prefix + '/lahan-sawah', tphMasterTahunController.lahanSawah);
/* -- ROUTE -- */

module.exports = route;
