const validasiKorluhTanamanBiofarmakaController = require('../controllers/validasiKorluhTanamanBiofarmaka.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-tanaman-biofarmaka';
/* -- ROUTE -- */
route.post(prefix + '/set', validasiKorluhTanamanBiofarmakaController.validate);
route.get(prefix + '/data', validasiKorluhTanamanBiofarmakaController.data);
/* -- ROUTE -- */

module.exports = route;