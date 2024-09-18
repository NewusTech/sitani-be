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
                hide: false,
                index: "jagungHibridaBantuanPemerintah",
                nama: "1) Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                hide: false,
                index: "jagungHibridaNonBantuanPemerintah",
                nama: "2) Non Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                hide: false,
                index: "jagungKomposit",
                nama: "b. Komposit",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                hide: false,
                index: "jagungLokal",
                nama: "c. Lokal",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                hide: false,
                index: "kedelaiBantuanPemerintah",
                nama: "a. Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                hide: false,
                index: "kedelaiNonBantuanPemerintah",
                nama: "b. Non Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 7,
                hide: false,
                index: "kacangTanah",
                nama: "Kacang Tanah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8,
                hide: false,
                index: "ubiKayuBantuanPemerintah",
                nama: "a. Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 9,
                hide: false,
                index: "ubiKayuNonBantuanPemerintah",
                nama: "b. Non Bantuan Pemerintah",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 10,
                hide: false,
                index: "ubiJalar",
                nama: "UBI JALAR/KETELA RAMBAT",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 11,
                hide: false,
                index: "kacangHijau",
                nama: "KACANG HIJAU",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 12,
                hide: false,
                index: "sorgum",
                nama: "SORGUM/CANTEL",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 13,
                hide: false,
                index: "gandum",
                nama: "GANDUM",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 14,
                hide: false,
                index: "talas",
                nama: "TALAS",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 15,
                hide: false,
                index: "ganyong",
                nama: "GANYONG",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 16,
                hide: false,
                index: "umbi",
                nama: "UMBI LAINNYA",
                created_at: new Date(),
                updated_at: new Date(),
            },
            // HIDE
            {
                id: 17,
                hide: true,
                index: "jagung",
                nama: "JUMLAH JAGUNG",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 18,
                hide: true,
                index: "jagungHibrida",
                nama: "a. Hibrida",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 19,
                hide: true,
                index: "kedelai",
                nama: "KEDELAI",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 20,
                hide: true,
                index: "ubiKayu",
                nama: "JUMLAH UBI KAYU/SINGKONG",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        await queryInterface.bulkInsert({ tableName: "korluh_master_palawija" }, dataList, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete({ tableName: "korluh_master_palawija" }, null, {});
    }
};
