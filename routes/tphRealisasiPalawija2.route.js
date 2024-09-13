const tphRealisasiPalawija2Controller = require('../controllers/tphRealisasiPalawija2.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/realisasi-palawija-2';
/* -- ROUTE -- */
route.post(prefix + '/create', tphRealisasiPalawija2Controller.create);
route.get(prefix + '/get', tphRealisasiPalawija2Controller.getAll);
route.get(prefix + '/get/:id', tphRealisasiPalawija2Controller.getOne);
route.put(prefix + '/update/:id', tphRealisasiPalawija2Controller.update);
route.delete(prefix + '/delete/:id', tphRealisasiPalawija2Controller.delete);
/* -- ROUTE -- */

module.exports = route;
