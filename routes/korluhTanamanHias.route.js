const korluhTanamanHiasController = require('../controllers/korluhTanamanHias.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/tanaman-hias';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhTanamanHiasController.create);
route.get(prefix + '/get', [mid.checkUserOrPass()], korluhTanamanHiasController.getAll);
route.get(prefix + '/get/:id', korluhTanamanHiasController.getOne);
route.put(prefix + '/update/:id', korluhTanamanHiasController.update);
route.delete(prefix + '/delete/:id', korluhTanamanHiasController.delete);
/* -- ROUTE -- */

module.exports = route;
