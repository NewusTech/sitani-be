'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidatorKorluhPadi extends Model {
        static associate(models) {
            ValidatorKorluhPadi.belongsTo(models.ValidasiKorluhPadi, {
                foreignKey: 'validasiKorluhPadiId',
                as: 'validasiKorluhPadi',
            });
            ValidatorKorluhPadi.belongsTo(models.User, {
                foreignKey: 'validatorId',
                as: 'validator',
            });
        }
    }

    ValidatorKorluhPadi.init({
        validasiKorluhPadiId: {
            type: DataTypes.BIGINT,
            field: 'validasi_korluh_padi_id'
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
        tableName: 'validator_korluh_padi',
        modelName: 'ValidatorKorluhPadi',
        sequelize,
    });

    return ValidatorKorluhPadi;
};