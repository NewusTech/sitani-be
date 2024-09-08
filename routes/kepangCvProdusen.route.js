const kepangCvProdusenController = require('../controllers/kepangCvProdusen.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/cv-produsen';
/* -- ROUTE -- */
route.post(prefix + '/create', kepangCvProdusenController.create);
/* -- ROUTE -- */

module.exports = route;
