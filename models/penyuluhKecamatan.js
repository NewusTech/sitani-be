'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKecamatan extends Model {
        static associate(models) {
            PenyuluhKecamatan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
            PenyuluhKecamatan.belongsToMany(models.Desa, {
                through: 'penyuluh_kecamatan_desabinaan',
                foreignKey: 'penyuluh_kecamatan_id',
                otherKey: 'desa_id',
                as: 'desa',
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
        tableName: 'penyuluh_kecamatan',
        modelName: 'PenyuluhKecamatan',
        createdAt: false,
        updatedAt: false,
        sequelize,
    });

    return PenyuluhKecamatan;
};