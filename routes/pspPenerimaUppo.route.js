const pspPenerimaUppoController = require('../controllers/pspPenerimaUppo.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penerima-uppo';
/* -- ROUTE -- */
route.post(prefix + '/create', pspPenerimaUppoController.create);
/* -- ROUTE -- */

module.exports = route;
