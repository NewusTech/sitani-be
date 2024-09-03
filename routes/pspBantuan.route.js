const pspBantuanController = require('../controllers/pspBantuan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/bantuan';
/* -- ROUTE -- */
route.post(prefix + '/create', pspBantuanController.create);
route.get(prefix + '/get', pspBantuanController.getAll);
// route.get(prefix + '/get/:id', pspBantuanController.getOneById);
// route.put(prefix + '/update/:id', pspBantuanController.update);
// route.delete(prefix + '/delete/:id', pspBantuanController.delete);
/* -- ROUTE -- */

module.exports = route;
