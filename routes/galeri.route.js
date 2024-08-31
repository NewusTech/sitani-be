const galeriController = require('../controllers/galeri.controller');
const express = require('express');

const route = express.Router();

let prefix = '/galeri';
/* -- ROUTE -- */
route.get(prefix + '/get', galeriController.getAllWithPagination);
/* -- ROUTE -- */

module.exports = route;
