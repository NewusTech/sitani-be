const articleController = require('../controllers/article.controller');
const express = require('express');
const multer = require('multer');

const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let prefix = '/article';
/* -- ROUTE -- */
route.post(prefix + '/create', upload.fields([{ name: 'image', maxCount: 1 }]), articleController.create);
route.get(prefix + '/get', articleController.getAllWithPagination);
route.get(prefix + '/get/:slug', articleController.getOneBySlug);
/* -- ROUTE -- */

module.exports = route;
