const tphRealisasiPalawija1Controller = require('../controllers/tphRealisasiPalawija1.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/realisasi-palawija-1';
/* -- ROUTE -- */
route.post(prefix + '/create', tphRealisasiPalawija1Controller.create);
route.get(prefix + '/get', tphRealisasiPalawija1Controller.getAll);
route.get(prefix + '/get/:id', tphRealisasiPalawija1Controller.getOne);
route.put(prefix + '/update/:id', tphRealisasiPalawija1Controller.update);
route.delete(prefix + '/delete/:id', tphRealisasiPalawija1Controller.delete);
/* -- ROUTE -- */

module.exports = route;
