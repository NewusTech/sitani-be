const korluhMasterPalawijaController = require('../controllers/korluhMasterPalawija.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/master-palawija';
/* -- ROUTE -- */
route.get(prefix + '/get', korluhMasterPalawijaController.getAll);
/* -- ROUTE -- */

module.exports = route;
