const articleController = require('../controllers/article.controller');
const express = require('express');

const route = express.Router();

let prefix = '/article';
/* -- ROUTE -- */
route.get(prefix + '/get', articleController.getAllWithPagination);
/* -- ROUTE -- */

module.exports = route;
