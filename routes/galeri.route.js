const galeriController = require('../controllers/galeri.controller');
const express = require('express');
const multer = require('multer');

const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let prefix = '/galeri';
/* -- ROUTE -- */
route.post(prefix + '/create', upload.fields([{ name: 'image', maxCount: 1 }]), galeriController.create);
route.get(prefix + '/get', galeriController.getAll);
route.get(prefix + '/get/:id', galeriController.getOneById);
route.put(prefix + '/update/:id', upload.fields([{ name: 'image', maxCount: 1 }]), galeriController.update);
route.delete(prefix + '/delete/:id', galeriController.delete);
/* -- ROUTE -- */

module.exports = route;
