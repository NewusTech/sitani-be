'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangPedagangEceran extends Model {
        static associate(models) {
            KepangPedagangEceran.hasMany(models.KepangPedagangEceranList, {
                foreignKey: 'kepangPedagangEceranId',
                as: 'list'
            });
        }
    }

    KepangPedagangEceran.init({
        tanggal: {
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
        tableName: 'kepang_pedagang_eceran',
        modelName: 'KepangPedagangEceran',
        sequelize,
    });

    return KepangPedagangEceran;
};