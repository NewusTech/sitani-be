const tphDashboardController = require('../controllers/tphDashboard.controller');
const express = require('express');

const route = express.Router();

let prefix = '/tph/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', tphDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
