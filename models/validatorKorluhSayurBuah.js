'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidatorKorluhSayurBuah extends Model {
        static associate(models) {
            ValidatorKorluhSayurBuah.belongsTo(models.ValidasiKorluhSayurBuah, {
                foreignKey: 'validasiKorluhSayurBuahId',
                as: 'validasiKorluhSayurBuah',
            });
            ValidatorKorluhSayurBuah.belongsTo(models.User, {
                foreignKey: 'validatorId',
                as: 'validator',
            });
        }
    }

    ValidatorKorluhSayurBuah.init({
        validasiKorluhSayurBuahId: {
            type: DataTypes.BIGINT,
            field: 'validasi_korluh_sayur_dan_buah_id'
        },
        validatorId: {
            type: DataTypes.BIGINT,
            field: 'validator_id'
        },
        email: {
            type: DataTypes.STRING(100),
        },
        nip: {
            type: DataTypes.STRING(20),
        },
        name: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('tolak', 'terima'),
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
        tableName: 'validator_korluh_sayur_dan_buah',
        modelName: 'ValidatorKorluhSayurBuah',
        sequelize,
    });

    return ValidatorKorluhSayurBuah;
};