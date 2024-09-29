const penyuluhMasterTahunController = require('../controllers/penyuluhMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/kelompok-tani', penyuluhMasterTahunController.kelompokTani);
/* -- ROUTE -- */

module.exports = route;
