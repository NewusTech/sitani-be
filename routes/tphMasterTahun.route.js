const tphMasterTahunController = require('../controllers/tphMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/lahan-bukan-sawah', tphMasterTahunController.lahanBukanSawah);
/* -- ROUTE -- */

module.exports = route;
