const penyuluhGabunganKelompokTaniController = require('../controllers/penyuluhGabunganKelompokTani.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-gabungan-kelompok-tani';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhGabunganKelompokTaniController.create);
route.get(prefix + '/get', penyuluhGabunganKelompokTaniController.getAll);
route.get(prefix + '/get/:id', penyuluhGabunganKelompokTaniController.getOne);
route.put(prefix + '/update/:id', penyuluhGabunganKelompokTaniController.update);
route.delete(prefix + '/delete/:id', penyuluhGabunganKelompokTaniController.delete);
/* -- ROUTE -- */

module.exports = route;
