const validasiKorluhPadiController = require('../controllers/validasiKorluhPadi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-padi';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhPadiController.kecVal);
route.post(prefix + '/kab', validasiKorluhPadiController.kabVal);
route.get(prefix + '/kec', validasiKorluhPadiController.kecData);
/* -- ROUTE -- */

module.exports = route;