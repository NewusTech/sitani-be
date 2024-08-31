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
        const roles = [
            {
                id: 1,
                role_name: "SUPER_ADMIN",
                description: "Super admin have many permissions",
            },
            {
                id: 2,
                role_name: "ADMIN",
                description: "Admin have some permissions",
            },
        ];

        await queryInterface.bulkInsert('roles', roles, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('roles', null, {});
    }
};
