const authController = require('../controllers/auth.controller');
const express = require('express');

const route = express.Router();

/* -- ROUTE -- */
route.post('/login', authController.login)
/* -- ROUTE -- */

module.exports = route;