const korluhPadiController = require('../controllers/korluhPadi.controller');
const mid = require('../middlewares/auth.middleware');
const express = require('express');

const route = express.Router();

let prefix = '/korluh/padi';
/* -- ROUTE -- */
route.post(prefix + '/create', korluhPadiController.create);
route.get(prefix + '/get', [mid.checkUserOrPass()], korluhPadiController.getAll);
route.get(prefix + '/get/:id', korluhPadiController.getOne);
route.put(prefix + '/update/:id', korluhPadiController.update);
route.delete(prefix + '/delete/:id', korluhPadiController.delete);
/* -- ROUTE -- */

module.exports = route;
