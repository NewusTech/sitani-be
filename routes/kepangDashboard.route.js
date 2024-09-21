const kepangDashboardController = require('../controllers/kepangDashboard.controller');
const express = require('express');

const route = express.Router();

let prefix = '/kepang/dashboard';
/* -- ROUTE -- */
route.get(prefix + '/get', kepangDashboardController.get);
/* -- ROUTE -- */

module.exports = route;
