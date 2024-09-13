'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphRealisasiPalawija1List extends Model {
        static associate(models) {
            TphRealisasiPalawija1List.belongsTo(models.TphRealisasiPalawija1, {
                foreignKey: 'tphRealisasiPalawija1Id',
                as: 'tphRealisasiPalawija1'
            });
            TphRealisasiPalawija1List.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
        }
    }

    TphRealisasiPalawija1List.init({
        tphRealisasiPalawija1Id: {
            type: DataTypes.BIGINT,
            field: 'tph_realisasi_palawija_1_id',
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
        tableName: 'tph_realisasi_palawija_1_list',
        modelName: 'TphRealisasiPalawija1List',
        sequelize,
    });

    return TphRealisasiPalawija1List;
};