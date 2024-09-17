const korluhMasterTanamanHiasController = require('../controllers/korluhMasterTanamanHias.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/master-tanaman-hias';
/* -- ROUTE -- */
route.get(prefix + '/get', korluhMasterTanamanHiasController.getAll);
/* -- ROUTE -- */

module.exports = route;
