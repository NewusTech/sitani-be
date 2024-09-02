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
        const kecamatan = [
            {
                id: 1,
                nama: "Kecamatan A",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "Kecamatan B",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "Kecamatan C",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "Kecamatan D",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "Kecamatan E",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "master_kecamatan" }, kecamatan, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "master_kecamatan" }, null, {});
    }
};
