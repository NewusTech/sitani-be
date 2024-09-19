const perkebunanDashboardController = require('../controllers/perkebunanDashboard.controller');
const express = require('express');

const route = express.Router();

let prefix = '/perkebunan/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', perkebunanDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
