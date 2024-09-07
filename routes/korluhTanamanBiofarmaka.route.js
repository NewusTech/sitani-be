const korluhTanamanBiofarmakaController = require('../controllers/korluhTanamanBiofarmaka.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/tanaman-biofarmaka';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhTanamanBiofarmakaController.create);
route.get(prefix + '/get', korluhTanamanBiofarmakaController.getAll);
route.get(prefix + '/get/:id', korluhTanamanBiofarmakaController.getOne);
route.put(prefix + '/update/:id', korluhTanamanBiofarmakaController.update);
route.delete(prefix + '/delete/:id', korluhTanamanBiofarmakaController.delete);
/* -- ROUTE -- */

module.exports = route;
