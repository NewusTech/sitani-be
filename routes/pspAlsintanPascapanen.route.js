const pspAlsintanPascapanenController = require('../controllers/pspAlsintanPascapanen.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/alsintan-pascapanen';
/* -- ROUTE -- */
route.post(prefix + '/create', pspAlsintanPascapanenController.create);
route.get(prefix + '/get', pspAlsintanPascapanenController.getAll);
/* -- ROUTE -- */

module.exports = route;
