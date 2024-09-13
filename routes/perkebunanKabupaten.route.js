const perkebunanKabupatenController = require('../controllers/perkebunanKabupaten.controller');
const express = require('express');

const route = express.Router();

let prefix = '/perkebunan/kabupaten';
/* -- ROUTE -- */
route.get(prefix + '/get', perkebunanKabupatenController.getAll);
/* -- ROUTE -- */

module.exports = route;
