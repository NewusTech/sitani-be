const kepangCvProdusenController = require('../controllers/kepangCvProdusen.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/cv-produsen';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangCvProdusenController.create);
route.get(prefix + '/get', kepangCvProdusenController.getAll);
route.get(prefix + '/get/:id', kepangCvProdusenController.getOne);
route.put(prefix + '/update/:id', kepangCvProdusenController.update);
route.delete(prefix + '/delete/:id', kepangCvProdusenController.delete);
/* -- ROUTE -- */

module.exports = route;
