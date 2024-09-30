const perkebunanDownloadController = require('../controllers/perkebunanDownload.controller');
const penyuluhDownloadController = require('../controllers/penyuluhDownload.controller');
const kepangDownloadController = require('../controllers/kepangDownload.controller');
const korluhDownloadController = require('../controllers/korluhDownload.controller');
const pspDownloadController = require('../controllers/pspDownload.controller');
const tphDownloadController = require('../controllers/tphDownload.controller');
const express = require('express');

const route = express.Router();

let prefix = '/download';
/* -- ROUTE -- */
route.get(prefix + '/perkebunan-kabupaten', perkebunanDownloadController.kabupaten);
route.get(prefix + '/perkebunan-kecamatan', perkebunanDownloadController.kecamatan);

route.get(prefix + '/penyuluh-gabungan-kelompok-tani', penyuluhDownloadController.gabunganKelompokTani);
route.get(prefix + '/penyuluh-kelompok-tani', penyuluhDownloadController.kelompokTani);
route.get(prefix + '/penyuluh-kabupaten', penyuluhDownloadController.kabupaten);
route.get(prefix + '/penyuluh-kecamatan', penyuluhDownloadController.kecamatan);

route.get(prefix + '/kepang-perbandingan-harga', kepangDownloadController.perbandinganHarga);
route.get(prefix + '/kepang-pedagang-eceran', kepangDownloadController.pedagangEceran);
route.get(prefix + '/kepang-produsen-eceran', kepangDownloadController.produsenEceran);
route.get(prefix + '/kepang-cv-produksi', kepangDownloadController.cvProduksi);
route.get(prefix + '/kepang-cv-produsen', kepangDownloadController.cvProdusen);

route.get(prefix + '/korluh-biofarmaka', korluhDownloadController.biofarmaka);
route.get(prefix + '/korluh-sayur-buah', korluhDownloadController.sayurBuah);
route.get(prefix + '/korluh-palawija', korluhDownloadController.palawija);
route.get(prefix + '/korluh-hias', korluhDownloadController.hias);
route.get(prefix + '/korluh-padi', korluhDownloadController.padi);

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
