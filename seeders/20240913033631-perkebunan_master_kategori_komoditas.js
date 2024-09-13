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
                nama: 'TAN. TAHUNAN',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nama: 'TAN. SEMUSIM',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nama: 'TAN. REMPAH DAN PENYEGAR',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "perkebunan_master_kategori_komoditas" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "perkebunan_master_kategori_komoditas" }, null, {});
    }
};
