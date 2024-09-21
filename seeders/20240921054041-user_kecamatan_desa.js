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
                user_id: 9,
                desa_id: 1,
                kecamatan_id: 1,
            },
            {
                user_id: 10,
                desa_id: 1,
                kecamatan_id: 1,
            },
        ];

        await queryInterface.bulkInsert({ tableName: "user_kecamatan_desa" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "user_kecamatan_desa" }, null, {});
    }
};
