'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidatorKorluhPalawija extends Model {
        static associate(models) {
            ValidatorKorluhPalawija.belongsTo(models.ValidasiKorluhPalawija, {
                foreignKey: 'validasiKorluhPalawijaId',
                as: 'validasiKorluhPalawija',
            });
            ValidatorKorluhPalawija.belongsTo(models.User, {
                foreignKey: 'validatorId',
                as: 'validator',
            });
        }
    }

    ValidatorKorluhPalawija.init({
        validasiKorluhPalawijaId: {
            type: DataTypes.BIGINT,
            field: 'validasi_korluh_palawija_id'
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
        tableName: 'validator_korluh_palawija',
        modelName: 'ValidatorKorluhPalawija',
        sequelize,
    });

    return ValidatorKorluhPalawija;
};