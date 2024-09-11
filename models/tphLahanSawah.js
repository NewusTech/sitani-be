'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphLahanSawah extends Model {
        static associate(models) {
            TphLahanSawah.hasMany(models.TphLahanSawahList, {
                foreignKey: 'tphLahanSawahId',
                as: 'list'
            });
        }
    }

    TphLahanSawah.init({
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
        tableName: 'tph_lahan_sawah',
        modelName: 'TphLahanSawah',
        sequelize,
    });

    return TphLahanSawah;
};