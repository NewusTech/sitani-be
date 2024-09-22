const kecamatanController = require('../controllers/kecamatan.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/kecamatan';
/* -- ROUTE -- */
route.get(prefix + '/get', [mid.checkUserOrPass([])], kecamatanController.getAll);
route.get(prefix + '/get/:id', kecamatanController.getOne);
/* -- ROUTE -- */

module.exports = route;
