'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidatorKorluhTanamanHias extends Model {
        static associate(models) {
            ValidatorKorluhTanamanHias.belongsTo(models.ValidasiKorluhTanamanHias, {
                foreignKey: 'validasiKorluhTanamanHiasId',
                as: 'validasiKorluhTanamanHias',
            });
            ValidatorKorluhTanamanHias.belongsTo(models.User, {
                foreignKey: 'validatorId',
                as: 'validator',
            });
        }
    }

    ValidatorKorluhTanamanHias.init({
        validasiKorluhTanamanHiasId: {
            type: DataTypes.BIGINT,
            field: 'validasi_korluh_tanaman_hias_id'
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
        tableName: 'validator_korluh_tanaman_hias',
        modelName: 'ValidatorKorluhTanamanHias',
        sequelize,
    });

    return ValidatorKorluhTanamanHias;
};