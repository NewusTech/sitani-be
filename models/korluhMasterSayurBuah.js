'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhMasterSayurBuah extends Model {
        static associate(models) {
        }
    }

    KorluhMasterSayurBuah.init({
        nama: {
            type: DataTypes.STRING,
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
        tableName: 'korluh_master_sayur_dan_buah',
        modelName: 'KorluhMasterSayurBuah',
        sequelize,
    });

    return KorluhMasterSayurBuah;
};