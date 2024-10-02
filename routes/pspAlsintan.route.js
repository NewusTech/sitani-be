const pspAlsintanController = require('../controllers/pspAlsintan.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/alsintan/';
/* -- ROUTE -- */
route.get(prefix + '/kecamatan', pspAlsintanController.getKecamatan);
/* -- ROUTE -- */

module.exports = route;
