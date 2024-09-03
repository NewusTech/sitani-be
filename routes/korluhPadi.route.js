const korluhPadiController = require('../controllers/korluhPadi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/padi';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhPadiController.create);
route.get(prefix + '/get', korluhPadiController.getAll);
route.get(prefix + '/get/one', korluhPadiController.getOne);
/* -- ROUTE -- */

module.exports = route;
