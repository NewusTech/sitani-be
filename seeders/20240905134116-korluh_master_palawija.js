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
                hide: false,
                nama: "Jagung Hibrida Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                hide: false,
                nama: "Jagung Hibrida Non Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                hide: false,
                nama: "Jagung Komposit",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                hide: false,
                nama: "Jagung Lokal",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                hide: false,
                nama: "Kedelai Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                hide: false,
                nama: "Kedelai Non Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                hide: false,
                nama: "Kacang Tanah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                hide: false,
                nama: "Ubi Kayu / Singkong Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                hide: false,
                nama: "Ubi Kayu / Singkong Non Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                hide: false,
                nama: "Ubi Jalar / Ketela Rambat",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                hide: false,
                nama: "Kacang Hijau",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                hide: false,
                nama: "Sorgum / Cantel",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                hide: false,
                nama: "Gandum",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                hide: false,
                nama: "Talas",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                hide: false,
                nama: "Ganyong",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                hide: false,
                nama: "Umbi Lainnya",
                created_at: new Date(),
                updated_at: new Date(),
            },
            // HIDE
            {
                id: 17,
                hide: true,
                nama: "Jagung",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                hide: true,
                nama: "Jagung Hibrida",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                hide: true,
                nama: "Kedelai",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                hide: true,
                nama: "Ubi Kayu / Singkong",
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
