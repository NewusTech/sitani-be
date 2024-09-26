'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhSayurBuah extends Model {
        static associate(models) {
            KorluhSayurBuah.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            KorluhSayurBuah.hasMany(models.KorluhSayurBuahList, {
                foreignKey: 'korluhSayurBuahId',
                as: 'list'
            });
        }
    }

    KorluhSayurBuah.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
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
        tableName: 'korluh_sayur_dan_buah',
        modelName: 'KorluhSayurBuah',
        sequelize,
    });

    return KorluhSayurBuah;
};