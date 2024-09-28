const validasiKorluhTanamanHiasController = require('../controllers/validasiKorluhTanamanHias.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/update/:id', validasiKorluhTanamanHiasController.reqValidation);
route.post(prefix + '/set', validasiKorluhTanamanHiasController.validate);
route.get(prefix + '/data', validasiKorluhTanamanHiasController.data);
/* -- ROUTE -- */

module.exports = route;