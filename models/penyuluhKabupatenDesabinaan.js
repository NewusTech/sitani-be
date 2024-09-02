'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKabupatenDesabinaan extends Model {
        static associate(models) {
            PenyuluhKabupatenDesabinaan.belongsTo(models.PenyuluhKabupaten, {
                foreignKey: 'penyuluhKabupatenId'
            });
            PenyuluhKabupatenDesabinaan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
        }
    }

    PenyuluhKabupatenDesabinaan.init({
        penyuluhKabupatenId: {
            type: DataTypes.BIGINT,
            field: 'penyuluh_kabupaten_id',
        },
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
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
        tableName: 'penyuluh_kabupaten_desabinaan',
        modelName: 'PenyuluhKabupatenDesabinaan',
        sequelize,
    });

    return PenyuluhKabupatenDesabinaan;
};