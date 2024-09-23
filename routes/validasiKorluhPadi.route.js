const validasiKorluhPadiController = require('../controllers/validasiKorluhPadi.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/validasi/korluh-padi';
/* -- ROUTE -- */
route.post(prefix + '/kec', validasiKorluhPadiController.kecVal);
route.post(prefix + '/kab', validasiKorluhPadiController.kabVal);
route.get(prefix + '/kec', [mid.checkUserOrPass()], validasiKorluhPadiController.kecData);
route.get(prefix + '/kab', validasiKorluhPadiController.kabData);
/* -- ROUTE -- */

module.exports = route;