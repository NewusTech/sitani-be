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
        await queryInterface.createTable('psp_alsintan_pascapanen', {
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

            chb_apbn: {
                type: Sequelize.INTEGER,
            },
            chb_tp: {
                type: Sequelize.INTEGER,
            },
            chb_apbd: {
                type: Sequelize.INTEGER,
            },

            chk_apbn: {
                type: Sequelize.INTEGER,
            },
            chk_tp: {
                type: Sequelize.INTEGER,
            },
            chk_apbd: {
                type: Sequelize.INTEGER,
            },

            power_thresher_apbn: {
                type: Sequelize.INTEGER,
            },
            power_thresher_tp: {
                type: Sequelize.INTEGER,
            },
            power_thresher_apbd: {
                type: Sequelize.INTEGER,
            },

            corn_sheller_apbn: {
                type: Sequelize.INTEGER,
            },
            corn_sheller_tp: {
                type: Sequelize.INTEGER,
            },
            corn_sheller_apbd: {
                type: Sequelize.INTEGER,
            },

            ptm_apbn: {
                type: Sequelize.INTEGER,
            },
            ptm_tp: {
                type: Sequelize.INTEGER,
            },
            ptm_apbd: {
                type: Sequelize.INTEGER,
            },

            ptm_mobile_apbn: {
                type: Sequelize.INTEGER,
            },
            ptm_mobile_tp: {
                type: Sequelize.INTEGER,
            },
            ptm_mobile_apbd: {
                type: Sequelize.INTEGER,
            },

            cs_mobile_apbn: {
                type: Sequelize.INTEGER,
            },
            cs_mobile_tp: {
                type: Sequelize.INTEGER,
            },
            cs_mobile_apbd: {
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
        await queryInterface.dropTable('psp_alsintan_pascapanen');
    }
};
