const bidangController = require('../controllers/bidang.controller');
const express = require('express');

const route = express.Router();

let prefix = '/bidang';
/* -- ROUTE -- */
route.get(prefix + '/get', bidangController.get);
route.post(prefix + '/create', bidangController.create);
route.get(prefix + '/get/:id', bidangController.getOneById);
route.put(prefix + '/update/:id', bidangController.update);
route.delete(prefix + '/delete/:id', bidangController.delete);
/* -- ROUTE -- */

module.exports = route;
