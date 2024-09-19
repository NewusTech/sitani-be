const korluhMasterTahunController = require('../controllers/korluhMasterTahun.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/master-tahun';
/* -- ROUTE -- */
route.get(prefix + '/tanaman-biofarmaka', korluhMasterTahunController.tanamanBiofarmaka);
route.get(prefix + '/tanaman-hias', korluhMasterTahunController.tanamanHias);
route.get(prefix + '/sayur-buah', korluhMasterTahunController.sayurBuah);
route.get(prefix + '/palawija', korluhMasterTahunController.palawija);
route.get(prefix + '/padi', korluhMasterTahunController.padi);
/* -- ROUTE -- */

module.exports = route;
