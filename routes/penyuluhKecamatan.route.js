const penyuluhKecamatanController = require('../controllers/penyuluhKecamatan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kecamatan';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKecamatanController.create);
/* -- ROUTE -- */

module.exports = route;
