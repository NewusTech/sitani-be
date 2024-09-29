const pspMasterTahunController = require('../controllers/pspMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/penerima-uppo', pspMasterTahunController.penerimaUppo);
/* -- ROUTE -- */

module.exports = route;
