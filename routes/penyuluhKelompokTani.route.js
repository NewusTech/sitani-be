const penyuluhKelompokTaniController = require('../controllers/penyuluhKelompokTani.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKelompokTaniController.create);
/* -- ROUTE -- */

module.exports = route;
