const pspAlsintanPrapanenController = require('../controllers/pspAlsintanPrapanen.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/alsintan-prapanen';
/* -- ROUTE -- */
route.post(prefix + '/create', pspAlsintanPrapanenController.create);
route.get(prefix + '/get', pspAlsintanPrapanenController.getAll);
/* -- ROUTE -- */

module.exports = route;
