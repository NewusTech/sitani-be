const kepangProdusenEceranController = require('../controllers/kepangProdusenEceran.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/produsen-eceran';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangProdusenEceranController.create);
route.get(prefix + '/get', kepangProdusenEceranController.getAll);
route.get(prefix + '/get/:id', kepangProdusenEceranController.getOne);
route.put(prefix + '/update/:id', kepangProdusenEceranController.update);
/* -- ROUTE -- */

module.exports = route;
