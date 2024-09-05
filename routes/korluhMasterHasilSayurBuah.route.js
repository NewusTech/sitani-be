const korluhMasterHasilSayurBuahController = require('../controllers/korluhMasterHasilSayurBuah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/hasil-sayur-buah';
/* -- ROUTE -- */
route.get(prefix + '/get', korluhMasterHasilSayurBuahController.getAll);
/* -- ROUTE -- */

module.exports = route;
