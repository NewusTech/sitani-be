'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidatorKorluhTanamanBiofarmaka extends Model {
        static associate(models) {
            ValidatorKorluhTanamanBiofarmaka.belongsTo(models.ValidasiKorluhTanamanBiofarmaka, {
                foreignKey: 'validasiKorluhTanamanBiofarmakaId',
                as: 'validasiKorluhTanamanBiofarmaka',
            });
            ValidatorKorluhTanamanBiofarmaka.belongsTo(models.User, {
                foreignKey: 'validatorId',
                as: 'validator',
            });
        }
    }

    ValidatorKorluhTanamanBiofarmaka.init({
        validasiKorluhTanamanBiofarmakaId: {
            type: DataTypes.BIGINT,
            field: 'validasi_korluh_tanaman_biofarmaka_id'
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
        tableName: 'validator_korluh_tanaman_biofarmaka',
        modelName: 'ValidatorKorluhTanamanBiofarmaka',
        sequelize,
    });

    return ValidatorKorluhTanamanBiofarmaka;
};