const userController = require('../controllers/user.controller');
const express = require('express');

const route = express.Router();

let prefix = '/user';
/* -- ROUTE -- */
route.post(prefix + '/create', userController.create);
/* -- ROUTE -- */

module.exports = route;