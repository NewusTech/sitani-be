const kepegawaianController = require('../controllers/kepegawaian.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepegawaian';
/* -- ROUTE -- */
route.get(prefix + '/get', kepegawaianController.get);
route.post(prefix + '/create', kepegawaianController.create);
route.get(prefix + '/get/:id', kepegawaianController.getOneById);
route.put(prefix + '/update/:id', kepegawaianController.update);
route.delete(prefix + '/delete/:id', kepegawaianController.delete);
route.get(prefix + '/dashboard', kepegawaianController.pensiunGet);
/* -- ROUTE -- */

module.exports = route;
