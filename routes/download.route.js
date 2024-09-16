const perkebunanDownloadController = require('../controllers/perkebunanDownload.controller');
const penyuluhDownloadController = require('../controllers/penyuluhDownload.controller');
const pspDownloadController = require('../controllers/pspDownload.controller');
const express = require('express');

const route = express.Router();

let prefix = '/download';
/* -- ROUTE -- */
route.get(prefix + '/perkebunan-kabupaten', perkebunanDownloadController.kabupaten);
route.get(prefix + '/perkebunan-kecamatan', perkebunanDownloadController.kecamatan);
route.get(prefix + '/penyuluh-kabupaten', penyuluhDownloadController.kabupaten);
route.get(prefix + '/penyuluh-kecamatan', penyuluhDownloadController.kecamatan);
route.get(prefix + '/psp-penerima-uppo', pspDownloadController.penerimaUppo);
route.get(prefix + '/psp-bantuan', pspDownloadController.bantuan);
route.get(prefix + '/psp-pupuk', pspDownloadController.pupuk);
/* -- ROUTE -- */

module.exports = route;
