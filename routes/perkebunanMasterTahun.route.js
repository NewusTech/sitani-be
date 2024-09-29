const perkebunanMasterTahunController = require('../controllers/perkebunanMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/perkebunan/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/kecamatan', perkebunanMasterTahunController.kecamatan);
/* -- ROUTE -- */

module.exports = route;
