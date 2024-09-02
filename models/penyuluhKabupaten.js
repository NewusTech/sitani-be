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