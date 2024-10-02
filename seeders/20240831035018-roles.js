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
        let roles = [];

        let i = 1;
        for (let temp of [
            'super admin',
            'bidang master',
            'bidang ketahanan pangan',
            'bidang kepegawaian',
            'korluh',
            'bidang penyuluh',
            'bidang perkebunan',
            'bidang psp',
            'bidang tanaman pangan dan hortikultura',
        ]) {
            roles.push({
                id: i,
                role_name: temp,
                description: "",
            });
            i++;
        }

        await queryInterface.bulkInsert({ tableName: "roles" }, roles, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "roles" }, null, {});
    }
};
