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
                nama: "JUMLAH JAGUNG",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "KEDELAI",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "KACANG TANAH",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "JUMLAH UBI KAYU/SINGKONG",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "UBI JALAR/KETELA RAMBAT",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                nama: "KACANG HIJAU",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                nama: "SORGUM/CANTEL",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                nama: "GANDUM",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                nama: "TALAS",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                nama: "GANYONG",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                nama: "UMBI LAINNYA",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                nama: "Hibrida",
                korluh_master_palawija_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                nama: "Komposit",
                korluh_master_palawija_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                nama: "Lokal",
                korluh_master_palawija_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                nama: "Bantuan Pemerintah",
                korluh_master_palawija_id: 12,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                nama: "Non Bantuan Pemerintah",
                korluh_master_palawija_id: 12,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 17,
                nama: "Bantuan Pemerintah",
                korluh_master_palawija_id: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                nama: "Non Bantuan Pemerintah",
                korluh_master_palawija_id: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                nama: "Bantuan Pemerintah",
                korluh_master_palawija_id: 4,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                nama: "Non Bantuan Pemerintah",
                korluh_master_palawija_id: 4,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "korluh_master_palawija" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "korluh_master_palawija" }, null, {});
    }
};
