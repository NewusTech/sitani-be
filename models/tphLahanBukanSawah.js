'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphLahanBukanSawah extends Model {
        static associate(models) {
            TphLahanBukanSawah.hasMany(models.TphLahanBukanSawahList, {
                foreignKey: 'tphLahanBukanSawahId',
                as: 'list'
            });
        }
    }

    TphLahanBukanSawah.init({
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
        tableName: 'tph_lahan_bukan_sawah',
        modelName: 'TphLahanBukanSawah',
        sequelize,
    });

    return TphLahanBukanSawah;
};