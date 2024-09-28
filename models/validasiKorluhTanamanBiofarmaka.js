'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ValidasiKorluhTanamanBiofarmaka extends Model {
        static associate(models) {
            ValidasiKorluhTanamanBiofarmaka.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
        }
    }

    ValidasiKorluhTanamanBiofarmaka.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id'
        },
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        triwulan: {
            type: DataTypes.CHAR,
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
        tableName: 'validasi_korluh_tanaman_biofarmaka',
        modelName: 'ValidasiKorluhTanamanBiofarmaka',
        sequelize,
    });

    return ValidasiKorluhTanamanBiofarmaka;
};