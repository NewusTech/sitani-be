const authController = require('../controllers/auth.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

/* -- ROUTE -- */
route.post('/login', authController.login);
route.get('/user-permission', [mid.checkPermissionAndLogout([])], authController.userPermissions);
/* -- ROUTE -- */

module.exports = route;