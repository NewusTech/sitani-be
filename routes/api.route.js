const perkebunanMasterKategoriKomoditasRoute = require('./perkebunanMasterKategoriKomoditas.route');
const validasiKorluhTanamanBiofarmakaRoute = require('./validasiKorluhTanamanBiofarmaka.route');
const korluhMasterTanamanBiofarmakaRoute = require('./korluhMasterTanamanBiofarmaka.route');
const penyuluhGabunganKelompokTaniRoute = require('./penyuluhGabunganKelompokTani.route');
const perkebunanMasterKomoditasRoute = require('./perkebunanMasterKomoditas.route');
const validasiKorluhTanamanHiasRoute = require('./validasiKorluhTanamanHias.route');
const kepangPerbandinganHargaRoute = require('./kepangPerbandinganHarga.route');
const korluhMasterTanamanHiasRoute = require('./korluhMasterTanamanHias.route');
const korluhTanamanBiofarmakaRoute = require('./korluhTanamanBiofarmaka.route');
const validasiKorluhSayurBuahRoute = require('./validasiKorluhSayurBuah.route');
const validasiKorluhPalawijaRoute = require('./validasiKorluhPalawija.route');
const kepangMasterKomoditasRoute = require('./kepangMasterKomoditas.route');
const korluhMasterSayurBuahRoute = require('./korluhMasterSayurBuah.route');
const perkebunanMasterTahunRoute = require('./perkebunanMasterTahun.route');
const pspAlsintanPascapanenRoute = require('./pspAlsintanPascapanen.route');
const tphRealisasiPalawija1Route = require('./tphRealisasiPalawija1.route');
const tphRealisasiPalawija2Route = require('./tphRealisasiPalawija2.route');
const kepangPedagangEceranRoute = require('./kepangPedagangEceran.route');
const kepangProdusenEceranRoute = require('./kepangProdusenEceran.route');
const korluhMasterPalawijaRoute = require('./korluhMasterPalawija.route');
const penyuluhKelompokTaniRoute = require('./penyuluhKelompokTani.route');
const korluhStatusLaporanRoute = require('./korluhStatusLaporan.route');
const penyuluhMasterTahunRoute = require('./penyuluhMasterTahun.route');
const perkebunanDashboardRoute = require('./perkebunanDashboard.route');
const perkebunanKabupatenRoute = require('./perkebunanKabupaten.route');
const perkebunanKecamatanRoute = require('./perkebunanKecamatan.route');
const pspAlsintanPrapanenRoute = require('./pspAlsintanPrapanen.route');
const tphLahanBukanSawahRoute = require('./tphLahanBukanSawah.route');
const validasiKorluhPadiRoute = require('./validasiKorluhPadi.route');
const kepangMasterTahunRoute = require('./kepangMasterTahun.route');
const korluhMasterTahunRoute = require('./korluhMasterTahun.route');
const korluhTanamanHiasRoute = require('./korluhTanamanHias.route');
const penyuluhKabupatenRoute = require('./penyuluhKabupaten.route');
const penyuluhKecamatanRoute = require('./penyuluhKecamatan.route');
const penyuluhDashboardRoute = require('./penyuluhDashboard.route');
const kepangCvProdusenRoute = require('./kepangCvProdusen.route');
const kepangCvProduksiRoute = require('./kepangCvProduksi.route');
const tphRealisasiPadiRoute = require('./tphRealisasiPadi.route');
const kepangDashboardRoute = require('./kepangDashboard.route');
const korluhDashboardRoute = require('./korluhDashboard.route');
const korluhSayurBuahRoute = require('./korluhSayurBuah.route');
const pspPenerimaUppoRoute = require('./pspPenerimaUppo.route');
const korluhPalawijaRoute = require('./korluhPalawija.route');
const pspMasterTahunRoute = require('./pspMasterTahun.route');
const tphMasterTahunRoute = require('./tphMasterTahun.route');
const tphLahanSawahRoute = require('./tphLahanSawah.route');
const pspDashboardRoute = require('./pspDashboard.route');
const tphDashboardRoute = require('./tphDashboard.route');
const kepegawaianRoute = require('./kepegawaian.route');
const pspAlsintanRoute = require('./pspAlsintan.route');
const korluhPadiRoute = require('./korluhPadi.route');
const permissionRoute = require('./permission.route');
const pspBantuanRoute = require('./pspBantuan.route');
const kecamatanRoute = require('./kecamatan.route');
const downloadRoute = require('./download.route');
const pspPupukRoute = require('./pspPupuk.route');
const articleRoute = require('./article.route');
const galeriRoute = require('./galeri.route');
const authRoute = require('./auth.route');
const desaRoute = require('./desa.route');
const roleRoute = require('./role.route');
const seedRoute = require('./seed.route');
const userRoute = require('./user.route');
const bidangRoute = require('./bidang.route');

module.exports = function (app, urlApi) {
    app.use(urlApi, perkebunanMasterKategoriKomoditasRoute);
    app.use(urlApi, validasiKorluhTanamanBiofarmakaRoute);
    app.use(urlApi, korluhMasterTanamanBiofarmakaRoute);
    app.use(urlApi, penyuluhGabunganKelompokTaniRoute);
    app.use(urlApi, perkebunanMasterKomoditasRoute);
    app.use(urlApi, validasiKorluhTanamanHiasRoute);
    app.use(urlApi, kepangPerbandinganHargaRoute);
    app.use(urlApi, korluhMasterTanamanHiasRoute);
    app.use(urlApi, korluhTanamanBiofarmakaRoute);
    app.use(urlApi, validasiKorluhSayurBuahRoute);
    app.use(urlApi, validasiKorluhPalawijaRoute);
    app.use(urlApi, kepangMasterKomoditasRoute);
    app.use(urlApi, korluhMasterSayurBuahRoute);
    app.use(urlApi, perkebunanMasterTahunRoute);
    app.use(urlApi, pspAlsintanPascapanenRoute);
    app.use(urlApi, tphRealisasiPalawija1Route);
    app.use(urlApi, tphRealisasiPalawija2Route);
    app.use(urlApi, kepangPedagangEceranRoute);
    app.use(urlApi, kepangProdusenEceranRoute);
    app.use(urlApi, korluhMasterPalawijaRoute);
    app.use(urlApi, penyuluhKelompokTaniRoute);
    app.use(urlApi, korluhStatusLaporanRoute);
    app.use(urlApi, penyuluhMasterTahunRoute);
    app.use(urlApi, perkebunanDashboardRoute);
    app.use(urlApi, perkebunanKabupatenRoute);
    app.use(urlApi, perkebunanKecamatanRoute);
    app.use(urlApi, pspAlsintanPrapanenRoute);
    app.use(urlApi, tphLahanBukanSawahRoute);
    app.use(urlApi, validasiKorluhPadiRoute);
    app.use(urlApi, kepangMasterTahunRoute);
    app.use(urlApi, korluhMasterTahunRoute);
    app.use(urlApi, korluhTanamanHiasRoute);
    app.use(urlApi, penyuluhKabupatenRoute);
    app.use(urlApi, penyuluhKecamatanRoute);
    app.use(urlApi, penyuluhDashboardRoute);
    app.use(urlApi, kepangCvProdusenRoute);
    app.use(urlApi, kepangCvProduksiRoute);
    app.use(urlApi, tphRealisasiPadiRoute);
    app.use(urlApi, kepangDashboardRoute);
    app.use(urlApi, korluhDashboardRoute);
    app.use(urlApi, korluhSayurBuahRoute);
    app.use(urlApi, pspPenerimaUppoRoute);
    app.use(urlApi, korluhPalawijaRoute);
    app.use(urlApi, pspMasterTahunRoute);
    app.use(urlApi, tphMasterTahunRoute);
    app.use(urlApi, tphLahanSawahRoute);
    app.use(urlApi, pspDashboardRoute);
    app.use(urlApi, tphDashboardRoute);
    app.use(urlApi, kepegawaianRoute);
    app.use(urlApi, pspAlsintanRoute);
    app.use(urlApi, korluhPadiRoute);
    app.use(urlApi, permissionRoute);
    app.use(urlApi, pspBantuanRoute);
    app.use(urlApi, kecamatanRoute);
    app.use(urlApi, downloadRoute);
    app.use(urlApi, pspPupukRoute);
    app.use(urlApi, articleRoute);
    app.use(urlApi, galeriRoute);
    app.use(urlApi, authRoute);
    app.use(urlApi, desaRoute);
    app.use(urlApi, roleRoute);
    // app.use(urlApi, seedRoute);
    app.use(urlApi, userRoute);
    app.use(urlApi, bidangRoute);
}