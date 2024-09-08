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
