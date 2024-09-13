'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphRealisasiPalawija2List extends Model {
        static associate(models) {
            TphRealisasiPalawija2List.belongsTo(models.TphRealisasiPalawija2, {
                foreignKey: 'tphRealisasiPalawija2Id',
                as: 'tphRealisasiPalawija2'
            });
            TphRealisasiPalawija2List.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
        }
    }

    TphRealisasiPalawija2List.init({
        tphRealisasiPalawija2Id: {
            type: DataTypes.BIGINT,
            field: 'tph_realisasi_palawija_2_id',
        },
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },

        kacangHijauPanen: {
            type: DataTypes.DOUBLE,
            field: 'kacang_hijau_panen'
        },
        kacangHijauProduktivitas: {
            type: DataTypes.DOUBLE,
            field: 'kacang_hijau_produktivitas'
        },
        kacangHijauProduksi: {
            type: DataTypes.DOUBLE,
            field: 'kacang_hijau_produksi'
        },
        ubiKayuPanen: {
            type: DataTypes.DOUBLE,
            field: 'ubi_kayu_panen'
        },
        ubiKayuProduktivitas: {
            type: DataTypes.DOUBLE,
            field: 'ubi_kayu_produktivitas'
        },
        ubiKayuProduksi: {
            type: DataTypes.DOUBLE,
            field: 'ubi_kayu_produksi'
        },
        ubiJalarPanen: {
            type: DataTypes.DOUBLE,
            field: 'ubi_jalar_panen'
        },
        ubiJalarProduktivitas: {
            type: DataTypes.DOUBLE,
            field: 'ubi_jalar_produktivitas'
        },
        ubiJalarProduksi: {
            type: DataTypes.DOUBLE,
            field: 'ubi_jalar_produksi'
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
        tableName: 'tph_realisasi_palawija_2_list',
        modelName: 'TphRealisasiPalawija2List',
        sequelize,
    });

    return TphRealisasiPalawija2List;
};