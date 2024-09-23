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
                desa_id: null,
                kecamatan_id: 1,
            },
            {
                user_id: 12,
                desa_id: 8,
                kecamatan_id: 2,
            },
            {
                user_id: 13,
                desa_id: 25,
                kecamatan_id: 3,
            },
            {
                user_id: 14,
                desa_id: null,
                kecamatan_id: 2,
            },
            {
                user_id: 15,
                desa_id: null,
                kecamatan_id: 3,
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
