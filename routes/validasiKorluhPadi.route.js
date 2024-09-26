const validasiKorluhPadiController = require('../controllers/validasiKorluhPadi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-padi';
/* -- ROUTE -- */
route.post(prefix + '/set', validasiKorluhPadiController.validate);
route.get(prefix + '/data', validasiKorluhPadiController.data);
/* -- ROUTE -- */

module.exports = route;