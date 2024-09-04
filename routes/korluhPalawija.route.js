const korluhPalawijaController = require('../controllers/korluhPalawija.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/palawija';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhPalawijaController.create);
route.get(prefix + '/get', korluhPalawijaController.getAll);
/* -- ROUTE -- */

module.exports = route;
