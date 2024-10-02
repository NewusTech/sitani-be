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
                email: "superadmin@mail.com",
                password: passwordHash.generate('superadmin#sitani'),
                name: "Super admin",
                nip: "1",
                pangkat: "Super admin",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                email: "master@mail.com",
                password: passwordHash.generate('master#sitani'),
                name: "Master",
                nip: "2",
                pangkat: "Master",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                email: "kepang@mail.com",
                password: passwordHash.generate('kepang#sitani'),
                name: "Ketahanan Pangan",
                nip: "3",
                pangkat: "Ketahana Pangan",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                email: "kepegawaian@mail.com",
                password: passwordHash.generate('kepegawaian#sitani'),
                name: "Kepegawaian",
                nip: "4",
                pangkat: "Kepegawaian",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                email: "korluh@mail.com",
                password: passwordHash.generate('korluh#sitani'),
                name: "korluh",
                nip: "5",
                pangkat: "korluh",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                email: "penyuluh@mail.com",
                password: passwordHash.generate('penyuluh#sitani'),
                name: "Penyuluh",
                nip: "6",
                pangkat: "Penyuluh",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                email: "perkebunan@mail.com",
                password: passwordHash.generate('perkebunan#sitani'),
                name: "Perkebunan",
                nip: "7",
                pangkat: "Perkebunan",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                email: "psp@mail.com",
                password: passwordHash.generate('psp#sitani'),
                name: "PSP",
                nip: "8",
                pangkat: "PSP",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                email: "tph@mail.com",
                password: passwordHash.generate('tph#sitani'),
                name: "Tanaman Pangan dan Hortikultura",
                nip: "9",
                pangkat: "Tanaman Pangan dan Hortikultura",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "users" }, users, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
        */
        await queryInterface.bulkDelete({ tableName: "users" }, null, {});
    }
};
