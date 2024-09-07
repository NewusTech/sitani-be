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
        const permissions = [
            {
                id: 1,
                permission_name: "semua",
                description: ""
            },
            {
                id: 2,
                permission_name: "berita tambah",
                description: ""
            },
            {
                id: 3,
                permission_name: "berita lihat",
                description: ""
            },
            {
                id: 4,
                permission_name: "berita ubah",
                description: ""
            },
            {
                id: 5,
                permission_name: "berita hapus",
                description: ""
            },
            {
                id: 6,
                permission_name: "galeri tambah",
                description: ""
            },
            {
                id: 7,
                permission_name: "galeri lihat",
                description: ""
            },
            {
                id: 8,
                permission_name: "galeri ubah",
                description: ""
            },
            {
                id: 9,
                permission_name: "galeri hapus",
                description: ""
            },
            {
                id: 10,
                permission_name: "penyuluh kabupaten tambah",
                description: ""
            },
            {
                id: 11,
                permission_name: "penyuluh kabupaten lihat",
                description: ""
            },
            {
                id: 12,
                permission_name: "penyuluh kabupaten ubah",
                description: ""
            },
            {
                id: 13,
                permission_name: "penyuluh kabupaten hapus",
                description: ""
            },
            {
                id: 14,
                permission_name: "penyuluh kecamatan tambah",
                description: ""
            },
            {
                id: 15,
                permission_name: "penyuluh kecamatan lihat",
                description: ""
            },
            {
                id: 16,
                permission_name: "penyuluh kecamatan ubah",
                description: ""
            },
            {
                id: 17,
                permission_name: "penyuluh kecamatan hapus",
                description: ""
            },
            {
                id: 18,
                permission_name: "psp uppo tambah",
                description: ""
            },
            {
                id: 19,
                permission_name: "psp uppo lihat",
                description: ""
            },
            {
                id: 20,
                permission_name: "psp uppo ubah",
                description: ""
            },
            {
                id: 21,
                permission_name: "psp uppo hapus",
                description: ""
            },
            {
                id: 22,
                permission_name: "psp pupuk tambah",
                description: ""
            },
            {
                id: 23,
                permission_name: "psp pupuk lihat",
                description: ""
            },
            {
                id: 24,
                permission_name: "psp pupuk ubah",
                description: ""
            },
            {
                id: 25,
                permission_name: "psp pupuk hapus",
                description: ""
            },
            {
                id: 26,
                permission_name: "psp bantuan tambah",
                description: ""
            },
            {
                id: 27,
                permission_name: "psp bantuan lihat",
                description: ""
            },
            {
                id: 28,
                permission_name: "psp bantuan ubah",
                description: ""
            },
            {
                id: 29,
                permission_name: "psp bantuan hapus",
                description: ""
            },
            {
                id: 30,
                permission_name: "kepegawaian tambah",
                description: ""
            },
            {
                id: 31,
                permission_name: "kepegawaian lihat",
                description: ""
            },
            {
                id: 32,
                permission_name: "kepegawaian ubah",
                description: ""
            },
            {
                id: 33,
                permission_name: "kepegawaian hapus",
                description: ""
            },
            {
                id: 34,
                permission_name: "korluh padi tambah",
                description: ""
            },
            {
                id: 35,
                permission_name: "korluh padi lihat",
                description: ""
            },
            {
                id: 36,
                permission_name: "korluh padi ubah",
                description: ""
            },
            {
                id: 37,
                permission_name: "korluh padi hapus",
                description: ""
            },
            {
                id: 38,
                permission_name: "korluh palawija tambah",
                description: ""
            },
            {
                id: 39,
                permission_name: "korluh palawija lihat",
                description: ""
            },
            {
                id: 40,
                permission_name: "korluh palawija ubah",
                description: ""
            },
            {
                id: 41,
                permission_name: "korluh palawija hapus",
                description: ""
            },
            {
                id: 42,
                permission_name: "korluh sayur buah tambah",
                description: ""
            },
            {
                id: 43,
                permission_name: "korluh sayur buah lihat",
                description: ""
            },
            {
                id: 44,
                permission_name: "korluh sayur buah ubah",
                description: ""
            },
            {
                id: 45,
                permission_name: "korluh sayur buah hapus",
                description: ""
            },
            {
                id: 46,
                permission_name: "korluh tanaman hias tambah",
                description: ""
            },
            {
                id: 47,
                permission_name: "korluh tanaman hias lihat",
                description: ""
            },
            {
                id: 48,
                permission_name: "korluh tanaman hias ubah",
                description: ""
            },
            {
                id: 49,
                permission_name: "korluh tanaman hias hapus",
                description: ""
            },
            {
                id: 50,
                permission_name: "korluh tanaman biofarmaka tambah",
                description: ""
            },
            {
                id: 51,
                permission_name: "korluh tanaman biofarmaka lihat",
                description: ""
            },
            {
                id: 52,
                permission_name: "korluh tanaman biofarmaka ubah",
                description: ""
            },
            {
                id: 53,
                permission_name: "korluh tanaman biofarmaka hapus",
                description: ""
            },
            {
                id: 54,
                permission_name: "kecamatan korluh padi validasi",
                description: ""
            },
            {
                id: 55,
                permission_name: "kecamatan korluh palawija validasi",
                description: ""
            },
            {
                id: 56,
                permission_name: "kecamatan korluh sayur buah validasi",
                description: ""
            },
            {
                id: 57,
                permission_name: "kecamatan korluh tanaman hias validasi",
                description: ""
            },
            {
                id: 58,
                permission_name: "kecamatan korluh tanaman biofarmaka validasi",
                description: ""
            },
            {
                id: 59,
                permission_name: "kabupaten korluh padi validasi",
                description: ""
            },
            {
                id: 60,
                permission_name: "kabupaten korluh palawija validasi",
                description: ""
            },
            {
                id: 61,
                permission_name: "kabupaten korluh sayur buah validasi",
                description: ""
            },
            {
                id: 62,
                permission_name: "kabupaten korluh tanaman hias validasi",
                description: ""
            },
            {
                id: 63,
                permission_name: "kabupaten korluh tanaman biofarmaka validasi",
                description: ""
            },
        ];

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
