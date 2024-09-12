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

        jagungPanen: {
            type: DataTypes.DOUBLE,
            field: 'jagung_panen'
        },
        jagungProduktivitas: {
            type: DataTypes.DOUBLE,
            field: 'jagung_produktivitas',
        },
        jagungProduksi: {
            type: DataTypes.DOUBLE,
            field: 'jagung_produksi'
        },
        kedelaiPanen: {
            type: DataTypes.DOUBLE,
            field: 'kedelai_panen'
        },
        kedelaiProduktivitas: {
            type: DataTypes.DOUBLE,
            field: 'kedelai_produktivitas'
        },
        kedelaiProduksi: {
            type: DataTypes.DOUBLE,
            field: 'kedelai_produksi'
        },
        kacangTanahPanen: {
            type: DataTypes.DOUBLE,
            field: 'kacang_tanah_panen'
        },
        kacangTanahProduktivitas: {
            type: DataTypes.DOUBLE,
            field: 'kacang_tanah_produktivitas'
        },
        kacangTanahProduksi: {
            type: DataTypes.DOUBLE,
            field: 'kacang_tanah_produksi'
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