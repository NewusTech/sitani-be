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
        const permissions = [
            {
                id: 1,
                permission_name: "ALL_CREATE",
                description: "Can create all data",
            },
            {
                id: 2,
                permission_name: "ALL_READ",
                description: "Can read all data",
            },
            {
                id: 3,
                permission_name: "ALL_UPDATE",
                description: "Can update all data",
            },
            {
                id: 4,
                permission_name: "ALL_DELETE",
                description: "Can delete all data",
            },
        ];

        await queryInterface.bulkInsert({ tableName: "permissions" }, permissions, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "permissions" }, null, {});
    }
};
