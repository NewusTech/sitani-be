const penyuluhKelompokTaniController = require('../controllers/penyuluhKelompokTani.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKelompokTaniController.create);
route.get(prefix + '/get', penyuluhKelompokTaniController.getAll);
route.get(prefix + '/get/:id', penyuluhKelompokTaniController.getOne);
route.put(prefix + '/update/:id', penyuluhKelompokTaniController.update);
route.delete(prefix + '/delete/:id', penyuluhKelompokTaniController.delete);
/* -- ROUTE -- */

module.exports = route;
