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
            'bidang tanaman pangan dan hortikultura',
            'bidang perkebunan',
            'bidang penyuluh',
            'bidang psp',
            'bidang kepegawaian',
            'korluh',
            'validasi kecamatan',
            'validasi kabupaten',
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
