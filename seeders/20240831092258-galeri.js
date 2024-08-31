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
        const galeri = [
            {
                id: 1,
                image: 'test1.png',
                deskripsi: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                image: 'test2.png',
                deskripsi: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                image: 'test3.png',
                deskripsi: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert('galeri', galeri, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('galeri', null, {});
    }
};
