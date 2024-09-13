const perkebunanKecamatanController = require('../controllers/perkebunanKecamatan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/perkebunan/kecamatan';
/* -- ROUTE -- */
route.post(prefix + '/create', perkebunanKecamatanController.create);
route.get(prefix + '/get', perkebunanKecamatanController.getAll);
route.get(prefix + '/get/:id', perkebunanKecamatanController.getOne);
route.put(prefix + '/update/:id', perkebunanKecamatanController.update);
route.delete(prefix + '/delete/:id', perkebunanKecamatanController.delete);
/* -- ROUTE -- */

module.exports = route;
