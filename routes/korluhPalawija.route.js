const korluhPalawijaController = require('../controllers/korluhPalawija.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/palawija';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhPalawijaController.create);
route.get(prefix + '/get', korluhPalawijaController.getAll);
route.get(prefix + '/get/:id', korluhPalawijaController.getOne);
/* -- ROUTE -- */

module.exports = route;
