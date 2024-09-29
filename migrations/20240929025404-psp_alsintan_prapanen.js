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
        await queryInterface.createTable('psp_alsintan_prapanen', {
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
            tahun: {
                type: Sequelize.INTEGER,
            },

            tr_4_apbn: {
                type: Sequelize.INTEGER,
            },
            tr_4_tp: {
                type: Sequelize.INTEGER,
            },
            tr_4_apbd: {
                type: Sequelize.INTEGER,
            },

            tr_2_apbn: {
                type: Sequelize.INTEGER,
            },
            tr_2_tp: {
                type: Sequelize.INTEGER,
            },
            tr_2_apbd: {
                type: Sequelize.INTEGER,
            },

            rt_apbn: {
                type: Sequelize.INTEGER,
            },
            rt_tp: {
                type: Sequelize.INTEGER,
            },
            rt_apbd: {
                type: Sequelize.INTEGER,
            },

            cornplanter_apbn: {
                type: Sequelize.INTEGER,
            },
            cornplanter_tp: {
                type: Sequelize.INTEGER,
            },
            cornplanter_apbd: {
                type: Sequelize.INTEGER,
            },

            cultivator_apbn: {
                type: Sequelize.INTEGER,
            },
            cultivator_tp: {
                type: Sequelize.INTEGER,
            },
            cultivator_apbd: {
                type: Sequelize.INTEGER,
            },

            hand_sprayer_apbn: {
                type: Sequelize.INTEGER,
            },
            hand_sprayer_tp: {
                type: Sequelize.INTEGER,
            },
            hand_sprayer_apbd: {
                type: Sequelize.INTEGER,
            },

            pompa_air_apbn: {
                type: Sequelize.INTEGER,
            },
            pompa_air_tp: {
                type: Sequelize.INTEGER,
            },
            pompa_air_apbd: {
                type: Sequelize.INTEGER,
            },

            keterangan: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('psp_alsintan_prapanen');
    }
};
