'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhPadi extends Model {
        static associate(models) {
            KorluhPadi.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            KorluhPadi.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    KorluhPadi.init({
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

        // Jumlah Padi lahan sawah
        jumlah_padi_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jumlah_padi_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        jumlah_padi_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Jumlah Padi lahan bukan sawah
        jumlah_padi_lahan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        jumlah_padi_lahan_bukan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        jumlah_padi_lahan_bukan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Hibrida lahan sawah
        hibrida_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        hibrida_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        hibrida_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Hibrida bantuan pemerintah lahan sawah
        hibrida_bantuan_pemerintah_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        hibrida_bantuan_pemerintah_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        hibrida_bantuan_pemerintah_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Hibrida non bantuan pemerintah lahan sawah
        hibrida_non_bantuan_pemerintah_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        hibrida_non_bantuan_pemerintah_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Unggul lahan sawah
        unggul_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        unggul_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        unggul_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Unggul lahan bukan sawah
        unggul_lahan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        unggul_lahan_bukan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        unggul_lahan_bukan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Unggul bantuan pemerintah lahan sawah
        unggul_bantuan_pemerintah_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        unggul_bantuan_pemerintah_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        unggul_bantuan_pemerintah_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Unggul bantuan pemerintah lahan bukan sawah
        unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Unggul non bantuan pemerintah lahan sawah
        unggul_non_bantuan_pemerintah_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        unggul_non_bantuan_pemerintah_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        unggul_non_bantuan_pemerintah_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Unggul non bantuan pemerintah lahan bukan sawah
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Lokal lahan sawah
        lokal_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        lokal_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        lokal_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Lokal lahan bukan sawah
        lokal_lahan_bukan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        lokal_lahan_bukan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        lokal_lahan_bukan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Sawah irigasi lahan sawah
        sawah_irigasi_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        sawah_irigasi_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        sawah_irigasi_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Sawah tadah hujan lahan sawah
        sawah_tadah_hujan_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        sawah_tadah_hujan_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        sawah_tadah_hujan_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Sawah rawa pasang surut lahan sawah
        sawah_rawa_pasang_surut_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        sawah_rawa_pasang_surut_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        sawah_rawa_pasang_surut_lahan_sawah_puso: {
            type: DataTypes.DOUBLE,
        },

        // Sawah rawa lebak lahan sawah
        sawah_rawa_lebak_lahan_sawah_panen: {
            type: DataTypes.DOUBLE,
        },
        sawah_rawa_lebak_lahan_sawah_tanam: {
            type: DataTypes.DOUBLE,
        },
        sawah_rawa_lebak_lahan_sawah_puso: {
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
        tableName: 'korluh_padi',
        modelName: 'KorluhPadi',
        sequelize,
    });

    return KorluhPadi;
};