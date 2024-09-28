'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidasiKorluhPalawija extends Model {
        static associate(models) {
            ValidasiKorluhPalawija.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
        }
    }

    ValidasiKorluhPalawija.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id'
        },
        bulan: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('belum', 'tolak', 'tunggu', 'terima'),
            defaultValue: 'belum',
            allowNull: false,
        },
        keterangan: {
            type: DataTypes.STRING,
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
        tableName: 'validasi_korluh_palawija',
        modelName: 'ValidasiKorluhPalawija',
        sequelize,
    });

    return ValidasiKorluhPalawija;
};