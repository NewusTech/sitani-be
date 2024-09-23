const validasiKorluhSayurBuahController = require('../controllers/validasiKorluhSayurBuah.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhSayurBuahController.kecVal);
route.post(prefix + '/kab', validasiKorluhSayurBuahController.kabVal);
route.get(prefix + '/kec', [mid.checkUserOrPass()], validasiKorluhSayurBuahController.kecData);
route.get(prefix + '/kab', validasiKorluhSayurBuahController.kabData);
/* -- ROUTE -- */

module.exports = route;