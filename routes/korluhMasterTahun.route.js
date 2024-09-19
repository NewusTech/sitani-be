const korluhMasterTahunController = require('../controllers/korluhMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/padi', korluhMasterTahunController.padi);
route.get(prefix + '/palawija', korluhMasterTahunController.palawija);
route.get(prefix + '/sayur-buah', korluhMasterTahunController.sayurBuah);
route.get(prefix + '/tanaman-biofarmaka', korluhMasterTahunController.tanamanBiofarmaka);
/* -- ROUTE -- */

module.exports = route;
