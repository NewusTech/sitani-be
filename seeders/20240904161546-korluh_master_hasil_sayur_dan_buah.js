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
                nama: "Daun segar",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "Umbi basah dg daun (konde basah)",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "Sayuran segar",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "Umbi basah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "Daun krop",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                nama: "Umbi dengan daun",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                nama: "Polongan basah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                nama: "Buah segar",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "korluh_master_hasil_sayur_dan_buah" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "korluh_master_hasil_sayur_dan_buah" }, null, {});
    }
};
