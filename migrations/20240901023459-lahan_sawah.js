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
        await queryInterface.createTable('lahan_sawah', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            kecamatan_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'master_kecamatan',
                    key: 'id'
                }
            },
            desa_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'master_desa',
                    key: 'id'
                }
            },
            irigasi_teknis: {
                type: Sequelize.DOUBLE,
            },
            irigasi_setengah_teknis: {
                type: Sequelize.DOUBLE,
            },
            irigasi_sederhana: {
                type: Sequelize.DOUBLE,
            },
            irigasi_desa: {
                type: Sequelize.DOUBLE,
            },
            tadah_hujan: {
                type: Sequelize.DOUBLE,
            },
            pasang_surut: {
                type: Sequelize.DOUBLE,
            },
            lebak: {
                type: Sequelize.DOUBLE,
            },
            lainnya: {
                type: Sequelize.DOUBLE,
            },
            jumlah: {
                type: Sequelize.DOUBLE,
            },
            keterangan: {
                type: Sequelize.DOUBLE,
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
        await queryInterface.dropTable('lahan_sawah');
    }
};
