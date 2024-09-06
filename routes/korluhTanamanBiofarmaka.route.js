const korluhTanamanBiofarmakaController = require('../controllers/korluhTanamanBiofarmaka.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/tanaman-biofarmaka';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhTanamanBiofarmakaController.create);
route.get(prefix + '/get', korluhTanamanBiofarmakaController.getAll);
/* -- ROUTE -- */

module.exports = route;
