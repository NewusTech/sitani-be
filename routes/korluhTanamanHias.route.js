const korluhTanamanHiasController = require('../controllers/korluhTanamanHias.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhTanamanHiasController.create);
/* -- ROUTE -- */

module.exports = route;
