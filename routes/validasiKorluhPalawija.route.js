const validasiKorluhPalawijaController = require('../controllers/validasiKorluhPalawija.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-palawija';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhPalawijaController.kecVal);
route.post(prefix + '/kab', validasiKorluhPalawijaController.kabVal);
route.get(prefix + '/kec', validasiKorluhPalawijaController.kecData);
route.get(prefix + '/kab', validasiKorluhPalawijaController.kabData);
/* -- ROUTE -- */

module.exports = route;