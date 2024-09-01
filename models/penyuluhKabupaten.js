'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKabupaten extends Model {
        static associate(models) {
            PenyuluhKabupaten.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
        }
    }

    PenyuluhKabupaten.init({
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
        tableName: 'penyuluh_kabupaten',
        modelName: 'PenyuluhKabupaten',
        createdAt: false,
        updatedAt: false,
        sequelize,
    });

    return PenyuluhKabupaten;
};