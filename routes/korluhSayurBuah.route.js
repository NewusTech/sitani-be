const korluhSayurBuahController = require('../controllers/korluhSayurBuah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhSayurBuahController.create);
route.get(prefix + '/get', korluhSayurBuahController.getAll);
/* -- ROUTE -- */

module.exports = route;
