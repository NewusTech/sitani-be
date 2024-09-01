'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKecamatan extends Model {
        static associate(models) {
            PenyuluhKecamatan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
        }
    }

    PenyuluhKecamatan.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nip: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pangkat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        golongan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        keterangan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'penyuluh_kecamatan',
        modelName: 'PenyuluhKecamatan',
        createdAt: false,
        updatedAt: false,
        sequelize,
    });

    return PenyuluhKecamatan;
};