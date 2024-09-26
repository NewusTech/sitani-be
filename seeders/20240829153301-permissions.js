'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        let permissions = [];

        let i = 1;
        for (let temp of [
            "semua",
            "pengguna tambah",
            "pengguna lihat",
            "pengguna ubah",
            "pengguna hapus",
            "berita tambah",
            "berita lihat",
            "berita ubah",
            "berita hapus",
            "galeri tambah",
            "galeri lihat",
            "galeri ubah",
            "galeri hapus",
            "kepang produsen eceran tambah",
            "kepang produsen eceran lihat",
            "kepang produsen eceran ubah",
            "kepang produsen eceran hapus",
            "kepang perbandingan harga tambah",
            "kepang perbandingan harga lihat",
            "kepang perbandingan harga ubah",
            "kepang perbandingan harga hapus",
            "kepang pedagang eceran tambah",
            "kepang pedagang eceran lihat",
            "kepang pedagang eceran ubah",
            "kepang pedagang eceran hapus",
            "kepang cv produksi tambah",
            "kepang cv produksi lihat",
            "kepang cv produksi ubah",
            "kepang cv produksi hapus",
            "kepang cv produsen tambah",
            "kepang cv produsen lihat",
            "kepang cv produsen ubah",
            "kepang cv produsen hapus",
            "tph realisasi padi tambah",
            "tph realisasi padi lihat",
            "tph realisasi padi ubah",
            "tph realisasi padi hapus",
            "tph realisasi palawija 1 tambah",
            "tph realisasi palawija 1 lihat",
            "tph realisasi palawija 1 ubah",
            "tph realisasi palawija 1 hapus",
            "tph realisasi palawija 2 tambah",
            "tph realisasi palawija 2 lihat",
            "tph realisasi palawija 2 ubah",
            "tph realisasi palawija 2 hapus",
            "tph lahan sawah tambah",
            "tph lahan sawah lihat",
            "tph lahan sawah ubah",
            "tph lahan sawah hapus",
            "tph lahan bukan sawah tambah",
            "tph lahan bukan sawah lihat",
            "tph lahan bukan sawah ubah",
            "tph lahan bukan sawah hapus",
            "perkebunan kabupaten tambah",
            "perkebunan kabupaten lihat",
            "perkebunan kabupaten ubah",
            "perkebunan kabupaten hapus",
            "perkebunan kecamatan tambah",
            "perkebunan kecamatan lihat",
            "perkebunan kecamatan ubah",
            "perkebunan kecamatan hapus",
            "penyuluh kabupaten tambah",
            "penyuluh kabupaten lihat",
            "penyuluh kabupaten ubah",
            "penyuluh kabupaten hapus",
            "penyuluh kecamatan tambah",
            "penyuluh kecamatan lihat",
            "penyuluh kecamatan ubah",
            "penyuluh kecamatan hapus",
            "psp uppo tambah",
            "psp uppo lihat",
            "psp uppo ubah",
            "psp uppo hapus",
            "psp pupuk tambah",
            "psp pupuk lihat",
            "psp pupuk ubah",
            "psp pupuk hapus",
            "psp bantuan tambah",
            "psp bantuan lihat",
            "psp bantuan ubah",
            "psp bantuan hapus",
            "kepegawaian tambah",
            "kepegawaian lihat",
            "kepegawaian ubah",
            "kepegawaian hapus",
            "korluh padi tambah",
            "korluh padi lihat",
            "korluh padi ubah",
            "korluh padi hapus",
            "korluh palawija tambah",
            "korluh palawija lihat",
            "korluh palawija ubah",
            "korluh palawija hapus",
            "korluh sayur buah tambah",
            "korluh sayur buah lihat",
            "korluh sayur buah ubah",
            "korluh sayur buah hapus",
            "korluh tanaman hias tambah",
            "korluh tanaman hias lihat",
            "korluh tanaman hias ubah",
            "korluh tanaman hias hapus",
            "korluh tanaman biofarmaka tambah",
            "korluh tanaman biofarmaka lihat",
            "korluh tanaman biofarmaka ubah",
            "korluh tanaman biofarmaka hapus",
        ]) {
            permissions.push({
                id: i,
                permission_name: temp,
                description: '',
            });
            i++;
        }

        await queryInterface.bulkInsert({ tableName: "permissions" }, permissions, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "permissions" }, null, {});
    }
};
