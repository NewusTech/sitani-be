const korluhMasterTahunController = require('../controllers/korluhMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/padi', korluhMasterTahunController.padi);
/* -- ROUTE -- */

module.exports = route;
