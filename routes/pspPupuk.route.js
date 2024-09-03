const pspPupukController = require('../controllers/pspPupuk.controller');
const express = require('express');

const route = express.Router();

let prefix = '/psp/pupuk';
/* -- ROUTE -- */
route.post(prefix + '/create', pspPupukController.create);
route.get(prefix + '/get', pspPupukController.getAll);
route.get(prefix + '/get/:id', pspPupukController.getOneById);
route.put(prefix + '/update/:id', pspPupukController.update);
// route.delete(prefix + '/delete/:id', pspPupukController.delete);
/* -- ROUTE -- */

module.exports = route;
