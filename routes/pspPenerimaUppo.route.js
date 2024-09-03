const pspPenerimaUppoController = require('../controllers/pspPenerimaUppo.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penerima-uppo';
/* -- ROUTE -- */
route.post(prefix + '/create', pspPenerimaUppoController.create);
route.get(prefix + '/get', pspPenerimaUppoController.getAll);
route.get(prefix + '/get/:id', pspPenerimaUppoController.getOneById);
route.put(prefix + '/update/:id', pspPenerimaUppoController.update);
/* -- ROUTE -- */

module.exports = route;
