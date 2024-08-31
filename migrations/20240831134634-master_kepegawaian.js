'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('master_kepegawaian', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            nama: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nip: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            tempat_lahir: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            tgl_lahir: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            pangkat: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            golongan: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            tmt_pangkat: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            jabatan: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            tmt_jabatan: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            nama_diklat: {
                type: Sequelize.STRING,
            },
            tgl_diklat: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            total_jam: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            nama_pendidikan: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            tahun_lulus: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            jenjang_pendidikan: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            usia: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            masa_kerja: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            keterangan: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
        */
        await queryInterface.dropTable('master_kepegawaian');
    }
};
