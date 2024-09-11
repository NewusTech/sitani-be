const tphLahanBukanSawahController = require('../controllers/tphLahanBukanSawah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/lahan-bukan-sawah';
/* -- ROUTE -- */
route.post(prefix + '/create', tphLahanBukanSawahController.create);
route.get(prefix + '/get', tphLahanBukanSawahController.getAll);
route.get(prefix + '/get/:id', tphLahanBukanSawahController.getOne);
route.put(prefix + '/update/:id', tphLahanBukanSawahController.update);
route.delete(prefix + '/delete/:id', tphLahanBukanSawahController.delete);
/* -- ROUTE -- */

module.exports = route;
