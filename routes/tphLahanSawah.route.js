const tphLahanSawahController = require('../controllers/tphLahanSawah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/lahan-sawah';
/* -- ROUTE -- */
route.post(prefix + '/create', tphLahanSawahController.create);
route.get(prefix + '/get', tphLahanSawahController.getAll);
route.get(prefix + '/get/:id', tphLahanSawahController.getOne);
route.put(prefix + '/update/:id', tphLahanSawahController.update);
route.delete(prefix + '/delete/:id', tphLahanSawahController.delete);
/* -- ROUTE -- */

module.exports = route;
