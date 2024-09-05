const korluhMasterSayurBuahController = require('../controllers/korluhMasterSayurBuah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/nama-sayur-buah';
/* -- ROUTE -- */
route.get(prefix + '/get', korluhMasterSayurBuahController.getAll);
/* -- ROUTE -- */

module.exports = route;
