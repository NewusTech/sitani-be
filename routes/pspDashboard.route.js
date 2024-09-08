const pspDashboardController = require('../controllers/pspDashboard.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', pspDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
