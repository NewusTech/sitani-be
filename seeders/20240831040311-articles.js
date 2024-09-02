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
        const articles = [
            {
                id: 1,
                judul: 'Judul 1',
                slug: 'judul-1',
                keyword: 'test',
                excerpt: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                tag: 'test',
                alt_image: 'test image',
                status: 0,
                image: 'test.png',
                konten: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt tempore eum repudiandae, ad fugit quod odit, eius natus officiis maxime fuga, earum doloribus dolorum quam et veniam quia quasi harum?',
                created_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                judul: 'Judul 2',
                slug: 'judul-2',
                keyword: 'test',
                excerpt: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?',
                tag: 'test',
                alt_image: 'test image',
                status: 1,
                image: 'test.png',
                konten: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam exercitationem eius, consequuntur, facere est ad magnam quod itaque doloribus velit illum ea ipsam rem voluptates non culpa nulla, perferendis corporis?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt tempore eum repudiandae, ad fugit quod odit, eius natus officiis maxime fuga, earum doloribus dolorum quam et veniam quia quasi harum?',
                created_by: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: 'articles' }, articles, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: 'articles' }, null, {});
    }
};
