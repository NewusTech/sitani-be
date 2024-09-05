'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhMasterHasilSayurBuah extends Model {
        static associate(models) {
        }
    }

    KorluhMasterHasilSayurBuah.init({
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
        tableName: 'korluh_master_hasil_sayur_dan_buah',
        modelName: 'KorluhMasterHasilSayurBuah',
        sequelize,
    });

    return KorluhMasterHasilSayurBuah;
};