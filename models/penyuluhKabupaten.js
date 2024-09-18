'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKabupaten extends Model {
        static associate(models) {
            PenyuluhKabupaten.belongsToMany(models.Kecamatan, {
                through: 'penyuluh_kabupaten_desabinaan',
                foreignKey: 'penyuluh_kabupaten_id',
                otherKey: 'kecamatan_id',
                as: 'kecamatan',
            });
        }
    }

    PenyuluhKabupaten.init({
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nip: {
            type: DataTypes.STRING(20),
        },
        pangkat: {
            type: DataTypes.STRING,
        },
        golongan: {
            type: DataTypes.STRING,
        },
        keterangan: {
            type: DataTypes.STRING,
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