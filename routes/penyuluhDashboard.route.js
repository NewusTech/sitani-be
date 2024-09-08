const penyuluhDashboardController = require('../controllers/penyuluhDashboard.controller');
const express = require('express');

const route = express.Router();

let prefix = '/penyuluh/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', penyuluhDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
