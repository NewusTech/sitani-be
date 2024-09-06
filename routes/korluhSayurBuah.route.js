const korluhSayurBuahController = require('../controllers/korluhSayurBuah.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhSayurBuahController.create);
route.get(prefix + '/get', korluhSayurBuahController.getAll);
route.get(prefix + '/get/:id', korluhSayurBuahController.getOne);
route.put(prefix + '/update/:id', korluhSayurBuahController.update);
/* -- ROUTE -- */

module.exports = route;
