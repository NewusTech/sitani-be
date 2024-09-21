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
        const dataList = [
            {
                id: 1,
                perkebunan_master_kategori_id: 1,
                nama: 'Aren',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                perkebunan_master_kategori_id: 1,
                nama: 'Kelapa Dalam',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                perkebunan_master_kategori_id: 1,
                nama: 'Kelapa Hibrida',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                perkebunan_master_kategori_id: 1,
                nama: 'Karet',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                perkebunan_master_kategori_id: 1,
                nama: 'Kelapa Sawit',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                perkebunan_master_kategori_id: 1,
                nama: 'Kapuk',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                perkebunan_master_kategori_id: 1,
                nama: 'Jambu Mete',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                perkebunan_master_kategori_id: 1,
                nama: 'Kemiri',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                perkebunan_master_kategori_id: 1,
                nama: 'Kenanga',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                perkebunan_master_kategori_id: 1,
                nama: 'Jarak Merah',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                perkebunan_master_kategori_id: 1,
                nama: 'Jarak Pagar',
                created_at: new Date(),
                updated_at: new Date(),
            },

            {
                id: 12,
                perkebunan_master_kategori_id: 2,
                nama: 'Tebu',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                perkebunan_master_kategori_id: 2,
                nama: 'Rami',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                perkebunan_master_kategori_id: 2,
                nama: 'Rosella',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                perkebunan_master_kategori_id: 2,
                nama: 'Yute ',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                perkebunan_master_kategori_id: 2,
                nama: 'Kenaf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 17,
                perkebunan_master_kategori_id: 2,
                nama: 'Tembakau',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                perkebunan_master_kategori_id: 2,
                nama: 'Wijen',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                perkebunan_master_kategori_id: 2,
                nama: 'Nilam',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                perkebunan_master_kategori_id: 2,
                nama: 'Sereh Wangi',
                created_at: new Date(),
                updated_at: new Date(),
            },

            {
                id: 21,
                perkebunan_master_kategori_id: 3,
                nama: 'Lada',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 22,
                perkebunan_master_kategori_id: 3,
                nama: 'Pala',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 23,
                perkebunan_master_kategori_id: 3,
                nama: 'Kayu Manis',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 24,
                perkebunan_master_kategori_id: 3,
                nama: 'Cengkeh',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 25,
                perkebunan_master_kategori_id: 3,
                nama: 'Vanili',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 26,
                perkebunan_master_kategori_id: 3,
                nama: 'Kopi Robusta',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 27,
                perkebunan_master_kategori_id: 3,
                nama: 'Kopi Arabika',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 28,
                perkebunan_master_kategori_id: 3,
                nama: 'T e h',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 29,
                perkebunan_master_kategori_id: 3,
                nama: 'Kakao',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 30,
                perkebunan_master_kategori_id: 3,
                nama: 'Kumis Kucing',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 31,
                perkebunan_master_kategori_id: 3,
                nama: 'Pinang ',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 32,
                perkebunan_master_kategori_id: 3,
                nama: 'Gambir',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 33,
                perkebunan_master_kategori_id: 3,
                nama: 'Cabe Jamu',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 34,
                perkebunan_master_kategori_id: 3,
                nama: 'Ketumbar',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 35,
                perkebunan_master_kategori_id: 3,
                nama: 'Jinten',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "perkebunan_master_komoditas" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "perkebunan_master_komoditas" }, null, {});
    }
};
