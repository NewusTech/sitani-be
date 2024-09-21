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
        const dataList = [
            {
                id: 1,
                nama: 'Harga GKP Tingkat Petani',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: 'Harga Gabah Kering Panen (GKP) Tingkat Penggilingan',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: 'Harga Gabah Kering Giling (GKG) Tingkat Penggilingan',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: 'Harga Beras Medium Tingkat Penggilingan',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: 'Harga Beras Premium Tingkat Penggilingan',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                nama: 'Jagung Pipilan Kering tk. Petani',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                nama: 'Cabai Merah Keriting tk. Petani',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                nama: 'Sapi Hidup Tk. Peternak',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                nama: 'Ayam Ras Pedaging (Hidup) Tk. Peternak',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                nama: 'Telur Ayam Ras Tk. peternak',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                nama: 'Beras Premium Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                nama: 'Beras Medium Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                nama: 'Kedelai Biji Kering (Impor) Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                nama: 'Bawang Merah Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                nama: 'Bawang Putih (Bonggol) Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                nama: 'Cabai Merah Keriting Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 17,
                nama: 'Cabai Rawit Merah Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                nama: 'Daging Sapi Murni Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                nama: 'Daging Ayam Ras Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                nama: 'Telur Ayam Ras Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 21,
                nama: 'Gula Pasir Curah/ Lokal Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 22,
                nama: 'Minyak Goreng Kemasan Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 23,
                nama: 'Tepung Terigu Curah Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 24,
                nama: 'Minyak Goreng Curah Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 25,
                nama: 'Jagung Pipil Kering (Tk. Peternak)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 26,
                nama: 'Ikan Kembung Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 27,
                nama: 'Ikan tongkol Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 28,
                nama: 'Ikan Bandeng Tk. Eceran',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 29,
                nama: 'Garan Halus',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 30,
                nama: 'Tepung Terigu Kemasan (non curah)',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "kepang_master_komoditas" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "kepang_master_komoditas" }, null, {});
    }
};
