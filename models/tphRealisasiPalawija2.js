'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphRealisasiPalawija2 extends Model {
        static associate(models) {
            TphRealisasiPalawija2.hasMany(models.TphRealisasiPalawija2List, {
                foreignKey: 'tphRealisasiPalawija2Id',
                as: 'list'
            });
        }
    }

    TphRealisasiPalawija2.init({
        bulan: {
            type: DataTypes.DATE,
            allowNull: false,
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
        tableName: 'tph_realisasi_palawija_2',
        modelName: 'TphRealisasiPalawija2',
        sequelize,
    });

    return TphRealisasiPalawija2;
};