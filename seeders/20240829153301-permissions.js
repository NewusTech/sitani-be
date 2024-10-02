'use strict';

const { PERMISSIONS } = require('../helpers/permissions.list');

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
        let permissions = [];

        let i = 1;
        for (let temp of PERMISSIONS) {
            permissions.push({
                id: i,
                permission_name: temp,
                description: '',
            });
            i++;
        }

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
