const penyuluhDownloadController = require('../controllers/penyuluhDownload.controller');
const express = require('express');

const route = express.Router();

let prefix = '/download';
/* -- ROUTE -- */
route.get(prefix + '/penyuluh-kabupaten', penyuluhDownloadController.kabupaten);
route.get(prefix + '/penyuluh-kecamatan/:kecamatan', penyuluhDownloadController.kecamatan);
/* -- ROUTE -- */

module.exports = route;
