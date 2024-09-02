const kecamatanController = require('../controllers/kecamatan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kecamatan';
/* -- ROUTE -- */
route.get(prefix + '/get', kecamatanController.getAll);
/* -- ROUTE -- */

module.exports = route;
