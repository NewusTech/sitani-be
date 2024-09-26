const validasiKorluhPalawijaController = require('../controllers/validasiKorluhPalawija.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-palawija';
/* -- ROUTE -- */
route.post(prefix + '/set', validasiKorluhPalawijaController.validate);
route.get(prefix + '/data', validasiKorluhPalawijaController.data);
/* -- ROUTE -- */

module.exports = route;