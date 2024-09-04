'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhPalawija extends Model {
        static associate(models) {
            KorluhPalawija.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            KorluhPalawija.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    KorluhPalawija.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },

        tanggal: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        // Jagung hibrida bantuan pemerintah lahan sawah
        jagung_hibrida_bantuan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung hibrida bantuan pemerintah lahan bukan sawah
        jagung_hibrida_bantuan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_bukan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_bukan_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_bantuan_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung hibrida non bantuan pemerintah lahan sawah
        jagung_hibrida_non_bantuan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung hibrida non bantuan pemerintah lahan bukan sawah
        jagung_hibrida_non_bantuan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_bukan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_bukan_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_hibrida_non_bantuan_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung komposit lahan sawah
        jagung_komposit_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung komposit lahan bukan sawah
        jagung_komposit_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_bukan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_bukan_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_komposit_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung lokal lahan sawah
        jagung_lokal_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jagung lokal lahan bukan sawah
        jagung_lokal_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_bukan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_bukan_sawah_panen_pakan_ternak: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        jagung_lokal_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kedelai bantuan pemerintah lahan sawah
        kedelai_bantuan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kedelai_bantuan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        kedelai_bantuan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kedelai_bantuan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kedelai bantuan pemerintah lahan bukan sawah
        kedelai_bantuan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kedelai_bantuan_bukan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        kedelai_bantuan_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kedelai_bantuan_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kedelai non bantuan pemerintah lahan sawah
        kedelai_non_bantuan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kedelai_non_bantuan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        kedelai_non_bantuan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kedelai_non_bantuan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kedelai non bantuan pemerintah lahan bukan sawah
        kedelai_non_bantuan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kedelai_non_bantuan_bukan_sawah_panen_muda: {
            type: DataTypes.DOUBLE,
        },
        kedelai_non_bantuan_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kedelai_non_bantuan_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kacang tanah lahan sawah
        kacang_tanah_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kacang_tanah_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kacang_tanah_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kacang tanah lahan bukan sawah
        kacang_tanah_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kacang_tanah_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kacang_tanah_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ubi kayu bantuan pemerintah lahan sawah
        ubi_kayu_bantuan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_bantuan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_bantuan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ubi kayu bantuan pemerintah lahan bukan sawah
        ubi_kayu_bantuan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_bantuan_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_bantuan_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ubi kayu non bantuan pemerintah lahan sawah
        ubi_kayu_non_bantuan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_non_bantuan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_non_bantuan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ubi kayu non bantuan pemerintah lahan bukan sawah
        ubi_kayu_non_bantuan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_non_bantuan_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ubi_kayu_non_bantuan_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ubi jalar lahan sawah
        ubi_jalar_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ubi_jalar_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ubi_jalar_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ubi jalar lahan bukan sawah
        ubi_jalar_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ubi_jalar_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ubi_jalar_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kacang hijau lahan sawah
        kacang_hijau_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kacang_hijau_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kacang_hijau_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Kacang hijau lahan bukan sawah
        kacang_hijau_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        kacang_hijau_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        kacang_hijau_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Sorgum lahan sawah
        sorgum_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        sorgum_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        sorgum_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Sorgum lahan bukan sawah
        sorgum_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        sorgum_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        sorgum_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Gandum lahan sawah
        gandum_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        gandum_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        gandum_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Gandum lahan bukan sawah
        gandum_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        gandum_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        gandum_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Talas lahan sawah
        talas_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        talas_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        talas_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Talas lahan bukan sawah
        talas_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        talas_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        talas_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ganyong lahan sawah
        ganyong_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ganyong_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ganyong_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Ganyong lahan bukan sawah
        ganyong_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        ganyong_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        ganyong_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Umbi lainnya lahan sawah
        lainnya_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        lainnya_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        lainnya_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        // Umbi lainnya lahan bukan sawah
        lainnya_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        lainnya_bukan_sawah_panen_tanam: {
            type: DataTypes.DOUBLE,
        },
        lainnya_bukan_sawah_panen_puso: {
            type: DataTypes.DOUBLE,
        },

        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            allowNull: false,
        },
    }, {
        tableName: 'korluh_palawija',
        modelName: 'KorluhPalawija',
        sequelize,
    });

    return KorluhPalawija;
};