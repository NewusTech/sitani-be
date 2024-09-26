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
        let dataList = [];
        let mapRole = [
            { role: 1, min: 1, max: 1 },
            { role: 2, min: 2, max: 13 },
            { role: 3, min: 14, max: 33 },
            { role: 4, min: 34, max: 53 },
            { role: 5, min: 54, max: 61 },
            { role: 6, min: 62, max: 69 },
            { role: 7, min: 70, max: 81 },
            { role: 8, min: 82, max: 85 },
            { role: 9, min: 86, max: 105 },
        ];

        mapRole.forEach(item => {
            for (let i = item.min; i <= item.max; i++) {
                dataList.push({
                    role_id: item.role,
                    permission_id: i,
                });
            }
        });

        await queryInterface.bulkInsert({ tableName: "role_permissions" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "role_permissions" }, null, {});
    }
};
