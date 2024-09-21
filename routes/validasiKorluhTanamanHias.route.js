const validasiKorluhTanamanHiasController = require('../controllers/validasiKorluhTanamanHias.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhTanamanHiasController.kecVal);
route.post(prefix + '/kab', validasiKorluhTanamanHiasController.kabVal);
route.get(prefix + '/kec', validasiKorluhTanamanHiasController.kecData);
route.get(prefix + '/kab', validasiKorluhTanamanHiasController.kabData);
/* -- ROUTE -- */

module.exports = route;