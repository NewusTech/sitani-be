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
        const kecamatan = [
            { nama: 'Metro Kibang', created_at: new Date(), updated_at: new Date() },
            { nama: 'Batanghari', created_at: new Date(), updated_at: new Date() },
            { nama: 'Sekampung', created_at: new Date(), updated_at: new Date() },
            { nama: 'Margatiga', created_at: new Date(), updated_at: new Date() },
            { nama: 'Sekampung Udik', created_at: new Date(), updated_at: new Date() },

            { nama: 'Jabung', created_at: new Date(), updated_at: new Date() },
            { nama: 'Pasir Sakti', created_at: new Date(), updated_at: new Date() },
            { nama: 'Waway Karya', created_at: new Date(), updated_at: new Date() },
            { nama: 'Marga Sekampung', created_at: new Date(), updated_at: new Date() },
            { nama: 'Labuhan Maringgai', created_at: new Date(), updated_at: new Date() },

            { nama: 'Mataram Baru', created_at: new Date(), updated_at: new Date() },
            { nama: 'Bandar Sribawono', created_at: new Date(), updated_at: new Date() },
            { nama: 'Melinting', created_at: new Date(), updated_at: new Date() },
            { nama: 'Gunung Pelindung', created_at: new Date(), updated_at: new Date() },
            { nama: 'Way Jepara', created_at: new Date(), updated_at: new Date() },

            { nama: 'Braja Slebah', created_at: new Date(), updated_at: new Date() },
            { nama: 'Labuhan Ratu', created_at: new Date(), updated_at: new Date() },
            { nama: 'Sukadana', created_at: new Date(), updated_at: new Date() },
            { nama: 'Bumi Agung', created_at: new Date(), updated_at: new Date() },
            { nama: 'Batanghari Nuban', created_at: new Date(), updated_at: new Date() },
            
            { nama: 'Pekalongan', created_at: new Date(), updated_at: new Date() },
            { nama: 'Raman Utara', created_at: new Date(), updated_at: new Date() },
            { nama: 'Purbolinggo', created_at: new Date(), updated_at: new Date() },
            { nama: 'Way Bungur', created_at: new Date(), updated_at: new Date() },
        ];

        await queryInterface.bulkInsert({ tableName: "master_kecamatan" }, kecamatan, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "master_kecamatan" }, null, {});
    }
};
