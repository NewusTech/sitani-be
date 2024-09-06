const korluhSayurBuahController = require('../controllers/korluhSayurBuah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhSayurBuahController.create);
/* -- ROUTE -- */

module.exports = route;
