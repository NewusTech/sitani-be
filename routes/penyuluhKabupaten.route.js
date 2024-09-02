const penyuluhKabupatenController = require('../controllers/penyuluhKabupaten.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kabupaten';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKabupatenController.create);
/* -- ROUTE -- */

module.exports = route;
