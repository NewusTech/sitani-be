const penyuluhKabupatenController = require('../controllers/penyuluhKabupaten.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh-kabupaten';
/* -- ROUTE -- */
route.post(prefix + '/create', penyuluhKabupatenController.create);
route.get(prefix + '/get', penyuluhKabupatenController.getAll);
route.get(prefix + '/get/:id', penyuluhKabupatenController.getOneById);
route.put(prefix + '/update/:id', penyuluhKabupatenController.update);
/* -- ROUTE -- */

module.exports = route;
