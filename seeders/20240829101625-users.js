'use strict';

const passwordHash = require('password-hash');

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
        const users = [
            {
                id: 1,
                email: "test@test.com",
                password: passwordHash.generate('test111'),
                name: "test 1",
                nip: 123456789,
                pangkat: "test 1",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                email: "test1@test.com",
                password: passwordHash.generate('test222'),
                name: "test 2",
                nip: 234567891,
                pangkat: "test 2",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert('users', users, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
        */
        await queryInterface.bulkDelete('users', null, {});
    }
};
