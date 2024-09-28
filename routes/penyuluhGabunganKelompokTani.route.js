const penyuluhGabunganKelompokTaniController = require('../controllers/penyuluhGabunganKelompokTani.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-gabungan-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhGabunganKelompokTaniController.create);
route.get(prefix + '/get', penyuluhGabunganKelompokTaniController.getAll);
/* -- ROUTE -- */

module.exports = route;
