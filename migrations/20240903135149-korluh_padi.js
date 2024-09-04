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
        await queryInterface.createTable('korluh_padi', {
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
            tanggal: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            // Hibrida bantuan pemerintah lahan sawah
            hibrida_bantuan_pemerintah_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            hibrida_bantuan_pemerintah_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            hibrida_bantuan_pemerintah_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },
            
            // Hibrida non bantuan pemerintah lahan sawah
            hibrida_non_bantuan_pemerintah_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            hibrida_non_bantuan_pemerintah_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Unggul bantuan pemerintah lahan sawah
            unggul_bantuan_pemerintah_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            unggul_bantuan_pemerintah_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            unggul_bantuan_pemerintah_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Unggul bantuan pemerintah lahan bukan sawah
            unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Unggul non bantuan pemerintah lahan sawah
            unggul_non_bantuan_pemerintah_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            unggul_non_bantuan_pemerintah_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            unggul_non_bantuan_pemerintah_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Unggul non bantuan pemerintah lahan bukan sawah
            unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Lokal lahan sawah
            lokal_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            lokal_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            lokal_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Lokal lahan bukan sawah
            lokal_lahan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            lokal_lahan_bukan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            lokal_lahan_bukan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Sawah irigasi lahan sawah
            sawah_irigasi_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            sawah_irigasi_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            sawah_irigasi_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Sawah tadah hujan lahan sawah
            sawah_tadah_hujan_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            sawah_tadah_hujan_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            sawah_tadah_hujan_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Sawah rawa pasang surut lahan sawah
            sawah_rawa_pasang_surut_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            sawah_rawa_pasang_surut_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            sawah_rawa_pasang_surut_lahan_sawah_puso: {
                type: Sequelize.DOUBLE,
            },

            // Sawah rawa lebak lahan sawah
            sawah_rawa_lebak_lahan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            sawah_rawa_lebak_lahan_sawah_tanam: {
                type: Sequelize.DOUBLE,
            },
            sawah_rawa_lebak_lahan_sawah_puso: {
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
        await queryInterface.dropTable('korluh_padi');
    }
};
