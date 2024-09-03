'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhPadi extends Model {
        static associate(models) {
            KorluhPadi.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    KorluhPadi.init({
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },

        tanggal: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        // Hibrida bantuan pemerintah lahan sawah
        hibridaBantuanPemerintahLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'hibrida_bantuan_pemerintah_lahan_sawah_panen',
        },
        hibridaBantuanPemerintahLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'hibrida_bantuan_pemerintah_lahan_sawah_tanam',
        },
        hibridaBantuanPemerintahLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'hibrida_bantuan_pemerintah_lahan_sawah_puso'
        },
        
        // Hibrida non bantuan pemerintah lahan sawah
        hibridaNonBantuanPemerintahLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'hibrida_non_bantuan_pemerintah_lahan_sawah_panen',
        },
        hibridaNonBantuanPemerintahLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'hibrida_non_bantuan_pemerintah_lahan_sawah_tanam',
        },
        hibridaNonBantuanPemerintahLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'hibrida_non_bantuan_pemerintah_lahan_sawah_puso',
        },

        // Unggul bantuan pemerintah lahan sawah
        unggulBantuanPemerintahLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'unggul_bantuan_pemerintah_lahan_sawah_panen'
        },
        unggulBantuanPemerintahLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'unggul_bantuan_pemerintah_lahan_sawah_tanam',
        },
        unggulBantuanPemerintahLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'unggul_bantuan_pemerintah_lahan_sawah_puso',
        },

        // Unggul bantuan pemerintah lahan bukan sawah
        unggulBantuanPemerintahLahanBukanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'unggul_bantuan_pemerintah_lahan_bukan_sawah_panen',
        },
        unggulBantuanPemerintahLahanBukanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam',
        },
        unggulBantuanPemerintahLahanBukanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'unggul_bantuan_pemerintah_lahan_bukan_sawah_puso',
        },

        // Unggul non bantuan pemerintah lahan sawah
        unggulNonBantuanPemerintahLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'unggul_non_bantuan_pemerintah_lahan_sawah_panen',
        },
        unggulNonBantuanPemerintahLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'unggul_non_bantuan_pemerintah_lahan_sawah_tanam',
        },
        unggulNonBantuanPemerintahLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'unggul_non_bantuan_pemerintah_lahan_sawah_puso',
        },

        // Unggul non bantuan pemerintah lahan bukan sawah
        unggulNonBantuanPemerintahLahanBukanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen',
        },
        unggulNonBantuanPemerintahLahanBukanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam',
        },
        unggulNonBantuanPemerintahLahanBukanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso',
        },

        // Lokal lahan sawah
        lokalLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'lokal_lahan_sawah_panen'
        },
        lokalLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'lokal_lahan_sawah_tanam'
        },
        lokalLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'lokal_lahan_sawah_puso'
        },

        // Lokal lahan bukan sawah
        lokalLahanBukanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'lokal_lahan_bukan_sawah_panen',
        },
        lokalLahanBukanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'lokal_lahan_bukan_sawah_tanam',
        },
        lokalLahanBukanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'lokal_lahan_bukan_sawah_puso'
        },

        // Sawah irigasi lahan sawah
        sawahIrigasiLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'sawah_irigasi_lahan_sawah_panen',
        },
        sawahIrigasiLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'sawah_irigasi_lahan_sawah_tanam',
        },
        sawahIrigasiLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'sawah_irigasi_lahan_sawah_puso',
        },

        // Sawah tadah hujan lahan sawah
        sawahTadahHujanLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'sawah_tadah_hujan_lahan_sawah_panen',
        },
        sawahTadahHujanLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'sawah_tadah_hujan_lahan_sawah_tanam',
        },
        sawahTadahHujanLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'sawah_tadah_hujan_lahan_sawah_puso',
        },

        // Sawah rawa pasang surut lahan sawah
        sawahRawaPasangSurutLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'sawah_rawa_pasang_surut_lahan_sawah_panen',
        },
        sawahRawaPasangSurutLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'sawah_rawa_pasang_surut_lahan_sawah_tanam',
        },
        sawahRawaPasangSurutLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'sawah_rawa_pasang_surut_lahan_sawah_puso',
        },

        // Sawah rawa lebak lahan sawah
        sawahRawaLebakLahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'sawah_rawa_lebak_lahan_sawah_panen',
        },
        sawahRawaLebakLahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'sawah_rawa_lebak_lahan_sawah_tanam',
        },
        sawahRawaLebakLahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'sawah_rawa_lebak_lahan_sawah_puso',
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