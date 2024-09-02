const penyuluhKecamatanController = require('../controllers/penyuluhKecamatan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kecamatan';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKecamatanController.create);
route.get(prefix + '/get', penyuluhKecamatanController.getAll);
route.get(prefix + '/get/:id', penyuluhKecamatanController.getOneById);
route.put(prefix + '/update/:id', penyuluhKecamatanController.update);
route.delete(prefix + '/delete/:id', penyuluhKecamatanController.delete);
/* -- ROUTE -- */

module.exports = route;
