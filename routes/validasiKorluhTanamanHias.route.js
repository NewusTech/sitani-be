const validasiKorluhTanamanHiasController = require('../controllers/validasiKorluhTanamanHias.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhTanamanHiasController.kecVal);
route.post(prefix + '/kab', validasiKorluhTanamanHiasController.kabVal);
route.get(prefix + '/kec', [mid.checkUserOrPass()], validasiKorluhTanamanHiasController.kecData);
route.get(prefix + '/kab', validasiKorluhTanamanHiasController.kabData);
/* -- ROUTE -- */

module.exports = route;