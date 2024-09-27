const penyuluhKelompokTaniController = require('../controllers/penyuluhKelompokTani.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKelompokTaniController.create);
route.get(prefix + '/get', penyuluhKelompokTaniController.getAll);
/* -- ROUTE -- */

module.exports = route;
