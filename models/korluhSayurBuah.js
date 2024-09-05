'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhSayurBuah extends Model {
        static associate(models) {
            KorluhSayurBuah.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
            KorluhSayurBuah.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
            KorluhSayurBuah.hasMany(models.KorluhSayurBuahList, {
                foreignKey: 'sayurBuahId',
                as: 'sayurBuahList'
            });
        }
    }

    KorluhSayurBuah.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
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