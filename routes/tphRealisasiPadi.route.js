const tphRealisasiPadiController = require('../controllers/tphRealisasiPadi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/realisasi-padi';
/* -- ROUTE -- */
route.post(prefix + '/create', tphRealisasiPadiController.create);
route.get(prefix + '/get', tphRealisasiPadiController.getAll);
route.get(prefix + '/get/:id', tphRealisasiPadiController.getOne);
route.put(prefix + '/update/:id', tphRealisasiPadiController.update);
route.delete(prefix + '/delete/:id', tphRealisasiPadiController.delete);
/* -- ROUTE -- */

module.exports = route;
