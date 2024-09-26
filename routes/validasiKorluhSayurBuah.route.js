const validasiKorluhSayurBuahController = require('../controllers/validasiKorluhSayurBuah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/set', validasiKorluhSayurBuahController.validate);
route.get(prefix + '/data', validasiKorluhSayurBuahController.data);
/* -- ROUTE -- */

module.exports = route;