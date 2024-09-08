const kepangPedagangEceranController = require('../controllers/kepangPedagangEceran.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/pedagang-eceran';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangPedagangEceranController.create);
/* -- ROUTE -- */

module.exports = route;
