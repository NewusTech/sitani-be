const validasiKorluhPadiController = require('../controllers/validasiKorluhPadi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-padi';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhPadiController.kecVal);
/* -- ROUTE -- */

module.exports = route;