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
        await queryInterface.createTable('korluh_palawija_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            korluh_palawija_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'korluh_palawija',
                    key: 'id'
                }
            },
            korluh_master_palawija_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'korluh_master_palawija',
                    key: 'id'
                }
            },

            lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            lahan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            lahan_sawah_panen_hijauan_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            lahan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            lahan_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            lahan_bukan_sawah_panen_hijauan_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            lahan_bukan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            lahan_bukan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },
            produksi: {
                type: Sequelize.DOUBLE,
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
        await queryInterface.dropTable('korluh_palawija_list');
    }
};
