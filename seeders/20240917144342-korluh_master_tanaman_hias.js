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
                nama: "Anggrek Potong",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "Gerbera (Herbas)",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "Krisan",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "Mawar",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "Sedap Malam",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                nama: "Aglaonema",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                nama: "Anggrek Pot",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                nama: "Anthurium Bunga",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                nama: "Bromelia",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                nama: "Bugenvil",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                nama: "Cordyline",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                nama: "Dracaena",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                nama: "Heliconia (Pisang-pisangan)",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                nama: "Ixora (Soka)",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                nama: "Pakis",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                nama: "Palem",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 17,
                nama: "Phylodendron",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                nama: "Puring",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                nama: "Sansevieria (Lidah mertua)",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                nama: "Melati",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "korluh_master_tanaman_hias" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "korluh_master_tanaman_hias" }, null, {});
    }
};
