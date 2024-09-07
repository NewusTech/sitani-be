'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangProdusenEceran extends Model {
        static associate(models) {
        }
    }

    KepangProdusenEceran.init({
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
        tableName: 'kepang_produsen_dan_eceran',
        modelName: 'KepangProdusenEceran',
        sequelize,
    });

    return KepangProdusenEceran;
};