'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphRealisasiPalawija1 extends Model {
        static associate(models) {
            TphRealisasiPalawija1.hasMany(models.TphRealisasiPalawija1List, {
                foreignKey: 'tphRealisasiPalawija1Id',
                as: 'list'
            });
        }
    }

    TphRealisasiPalawija1.init({
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
        tableName: 'tph_realisasi_palawija_1',
        modelName: 'TphRealisasiPalawija1',
        sequelize,
    });

    return TphRealisasiPalawija1;
};