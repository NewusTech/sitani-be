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
                nama: "Jahe",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "Jeruk Nipis",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "Kepulaga",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "Kencur",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "Kunyit",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                nama: "Laos/Lengkuas",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                nama: "Lempuyang",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                nama: "Lidah Buaya",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                nama: "Mahkota Dewa",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                nama: "Mengkudu/Pace",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                nama: "Sambiloto",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                nama: "Serai",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                nama: "Temuireng",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                nama: "Temukunci",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                nama: "Temulawak",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "korluh_master_tanaman_biofarmaka" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "korluh_master_tanaman_biofarmaka" }, null, {});
    }
};
