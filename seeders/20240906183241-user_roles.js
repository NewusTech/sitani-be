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
        const dataList = [];

        for (let i = 1; i <= 11; i++) {
            dataList.push({
                role_id: i,
                user_id: i,
            })
        }
        dataList.push({ role_id: 9, user_id: 12 }, { role_id: 9, user_id: 13 }, { role_id: 10, user_id: 14 }, { role_id: 10, user_id: 15 });

        await queryInterface.bulkInsert({ tableName: "user_roles" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "user_roles" }, null, {});
    }
};
