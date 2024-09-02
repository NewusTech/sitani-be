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
        const desa = [
            {
                id: 1,
                nama: "Desa A",
                kecamatan_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: "Desa B",
                kecamatan_id: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: "Desa C",
                kecamatan_id: 3,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nama: "Desa D",
                kecamatan_id: 4,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                nama: "Desa E",
                kecamatan_id: 5,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: 'master_desa' }, desa, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: 'master_desa' }, null, {});
    }
};
