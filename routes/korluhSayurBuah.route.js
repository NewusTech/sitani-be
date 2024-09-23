const korluhSayurBuahController = require('../controllers/korluhSayurBuah.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/sayur-buah';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhSayurBuahController.create);
route.get(prefix + '/get', [mid.checkUserOrPass()], korluhSayurBuahController.getAll);
route.get(prefix + '/get/:id', korluhSayurBuahController.getOne);
route.put(prefix + '/update/:id', korluhSayurBuahController.update);
route.delete(prefix + '/delete/:id', korluhSayurBuahController.delete);
/* -- ROUTE -- */

module.exports = route;
