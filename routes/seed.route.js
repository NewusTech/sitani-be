const seedController = require('../controllers/seed.controller');
const express = require('express');

const route = express.Router();

let prefix = '/seed';
/* -- ROUTE -- */
route.get(prefix + '/permission', seedController.permission);
route.get(prefix + '/kecamatan', seedController.kecamatan);
route.get(prefix + '/artikel', seedController.artikel);
route.get(prefix + '/galeri', seedController.galeri);
route.get(prefix + '/desa', seedController.desa);
route.get(prefix + '/role', seedController.role);
route.get(prefix + '/user', seedController.user);
/* -- ROUTE -- */

module.exports = route;