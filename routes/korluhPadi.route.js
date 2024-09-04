const korluhPadiController = require('../controllers/korluhPadi.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/padi';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhPadiController.create);
route.get(prefix + '/get', korluhPadiController.getAll);
route.get(prefix + '/get/one', korluhPadiController.getOne);
route.put(prefix + '/update/:id', korluhPadiController.update);
route.delete(prefix + '/delete/:id', korluhPadiController.delete);
/* -- ROUTE -- */

module.exports = route;
