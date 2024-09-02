const penyuluhKecamatanController = require('../controllers/penyuluhKecamatan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kecamatan';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKecamatanController.create);
route.get(prefix + '/get', penyuluhKecamatanController.getAll);
/* -- ROUTE -- */

module.exports = route;
