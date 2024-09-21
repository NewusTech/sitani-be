const validasiKorluhTanamanBiofarmakaController = require('../controllers/validasiKorluhTanamanBiofarmaka.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-tanaman-biofarmaka';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhTanamanBiofarmakaController.kecVal);
route.post(prefix + '/kab', validasiKorluhTanamanBiofarmakaController.kabVal);
route.get(prefix + '/kec', validasiKorluhTanamanBiofarmakaController.kecData);
route.get(prefix + '/kab', validasiKorluhTanamanBiofarmakaController.kabData);
/* -- ROUTE -- */

module.exports = route;