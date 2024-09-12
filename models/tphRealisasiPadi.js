'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphRealisasiPadi extends Model {
        static associate(models) {
            TphRealisasiPadi.hasMany(models.TphRealisasiPadiList, {
                foreignKey: 'tphRealisasiPadiId',
                as: 'list'
            });
        }
    }

    TphRealisasiPadi.init({
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
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
        tableName: 'tph_realisasi_padi',
        modelName: 'TphRealisasiPadi',
        sequelize,
    });

    return TphRealisasiPadi;
};