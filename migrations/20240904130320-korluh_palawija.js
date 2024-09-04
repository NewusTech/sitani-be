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
        await queryInterface.createTable('korluh_palawija', {
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
            
            // Jagung hibrida bantuan pemerintah lahan sawah
            jagung_hibrida_bantuan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung hibrida bantuan pemerintah lahan bukan sawah
            jagung_hibrida_bantuan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_bantuan_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung hibrida non bantuan pemerintah lahan sawah
            jagung_hibrida_non_bantuan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung hibrida non bantuan pemerintah lahan bukan sawah
            jagung_hibrida_non_bantuan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_hibrida_non_bantuan_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung komposit lahan sawah
            jagung_komposit_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung komposit lahan bukan sawah
            jagung_komposit_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_bukan_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_komposit_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung lokal lahan sawah
            jagung_lokal_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Jagung lokal lahan bukan sawah
            jagung_lokal_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_bukan_sawah_panen_pakan_ternak: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            jagung_lokal_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kedelai bantuan pemerintah lahan sawah
            kedelai_bantuan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kedelai_bantuan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            kedelai_bantuan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kedelai_bantuan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kedelai bantuan pemerintah lahan bukan sawah
            kedelai_bantuan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kedelai_bantuan_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            kedelai_bantuan_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kedelai_bantuan_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kedelai non bantuan pemerintah lahan sawah
            kedelai_non_bantuan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kedelai_non_bantuan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            kedelai_non_bantuan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kedelai_non_bantuan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kedelai non bantuan pemerintah lahan bukan sawah
            kedelai_non_bantuan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kedelai_non_bantuan_bukan_sawah_panen_muda: {
                type: Sequelize.DOUBLE,
            },
            kedelai_non_bantuan_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kedelai_non_bantuan_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kacang tanah lahan sawah
            kacang_tanah_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kacang tanah lahan bukan sawah
            kacang_tanah_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kacang_tanah_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ubi kayu bantuan pemerintah lahan sawah
            ubi_kayu_bantuan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_bantuan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_bantuan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ubi kayu bantuan pemerintah lahan bukan sawah
            ubi_kayu_bantuan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_bantuan_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_bantuan_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ubi kayu non bantuan pemerintah lahan sawah
            ubi_kayu_non_bantuan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_non_bantuan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_non_bantuan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ubi kayu non bantuan pemerintah lahan bukan sawah
            ubi_kayu_non_bantuan_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_non_bantuan_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ubi_kayu_non_bantuan_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ubi jalar lahan sawah
            ubi_jalar_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ubi jalar lahan bukan sawah
            ubi_jalar_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ubi_jalar_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kacang hijau lahan sawah
            kacang_hijau_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kacang_hijau_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kacang_hijau_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Kacang hijau lahan bukan sawah
            kacang_hijau_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            kacang_hijau_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            kacang_hijau_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Sorgum lahan sawah
            sorgum_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            sorgum_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            sorgum_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Sorgum lahan bukan sawah
            sorgum_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            sorgum_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            sorgum_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Gandum lahan sawah
            gandum_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            gandum_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            gandum_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Gandum lahan bukan sawah
            gandum_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            gandum_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            gandum_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Talas lahan sawah
            talas_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            talas_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            talas_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Talas lahan bukan sawah
            talas_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            talas_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            talas_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ganyong lahan sawah
            ganyong_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ganyong_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ganyong_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Ganyong lahan bukan sawah
            ganyong_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            ganyong_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            ganyong_bukan_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Umbi lainnya lahan sawah
            lainnya_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            lainnya_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            lainnya_sawah_panen_puso: {
                type: Sequelize.DOUBLE,
            },

            // Umbi lainnya lahan bukan sawah
            lainnya_bukan_sawah_panen: {
                type: Sequelize.DOUBLE,
            },
            lainnya_bukan_sawah_panen_tanam: {
                type: Sequelize.DOUBLE,
            },
            lainnya_bukan_sawah_panen_puso: {
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
        await queryInterface.dropTable('korluh_palawija');
    }
};
