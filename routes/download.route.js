const perkebunanDownloadController = require('../controllers/perkebunanDownload.controller');
const penyuluhDownloadController = require('../controllers/penyuluhDownload.controller');
const pspDownloadController = require('../controllers/pspDownload.controller');
const tphDownloadController = require('../controllers/tphDownload.controller');
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
route.get(prefix + '/tph-realisasi-palawija-1', tphDownloadController.realisasiPalawija1);
route.get(prefix + '/tph-realisasi-palawija-2', tphDownloadController.realisasiPalawija2);
route.get(prefix + '/tph-lahan-bukan-sawah', tphDownloadController.lahanBukanSawah);
route.get(prefix + '/tph-realisasi-padi', tphDownloadController.realisasiPadi);
route.get(prefix + '/tph-lahan-sawah', tphDownloadController.lahanSawah);
/* -- ROUTE -- */

module.exports = route;
