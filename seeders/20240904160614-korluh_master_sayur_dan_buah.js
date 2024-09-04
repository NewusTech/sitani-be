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
                nama: "Bawang Daun",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "Bawang Merah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "Bawang Putih",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "Kembang Kol",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "Kentang",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                nama: "Kubis",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                nama: "Petsai/Sawi",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                nama: "Wortel",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                nama: "Bayam",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                nama: "Buncis",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                nama: "Cabai Besar/TW/Teropong",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                nama: "Cabai Keriting",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                nama: "Cabai Rawit",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                nama: "Jamur Tiram",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                nama: "Jamur Merang",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                nama: "Jamur Lainnya",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 17,
                nama: "Kacang Panjang",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                nama: "Kangkung",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                nama: "Mentimun",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                nama: "Labu Siam",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 21,
                nama: "Paprika",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 22,
                nama: "Terung",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 23,
                nama: "Tomat",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 24,
                nama: "Melon",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 25,
                nama: "Semangka",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 26,
                nama: "Stroberi",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "korluh_master_sayur_dan_buah" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "korluh_master_sayur_dan_buah" }, null, {});
    }
};
