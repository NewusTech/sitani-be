const korluhDashboardController = require('../controllers/korluhDashboard.controller');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', korluhDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
