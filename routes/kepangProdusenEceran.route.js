const kepangProdusenEceranController = require('../controllers/kepangProdusenEceran.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/produsen-eceran';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangProdusenEceranController.create);
/* -- ROUTE -- */

module.exports = route;
