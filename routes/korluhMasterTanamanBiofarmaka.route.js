const korluhMasterTanamanBiofarmakaController = require('../controllers/korluhMasterTanamanBiofarmaka.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/master-tanaman-biofarmaka';
/* -- ROUTE -- */
route.get(prefix + '/get', korluhMasterTanamanBiofarmakaController.getAll);
/* -- ROUTE -- */

module.exports = route;
