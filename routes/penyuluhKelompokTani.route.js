const penyuluhKelompokTaniController = require('../controllers/penyuluhKelompokTani.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKelompokTaniController.create);
route.get(prefix + '/get', penyuluhKelompokTaniController.getAll);
route.get(prefix + '/get/:id', penyuluhKelompokTaniController.getOne);
/* -- ROUTE -- */

module.exports = route;
