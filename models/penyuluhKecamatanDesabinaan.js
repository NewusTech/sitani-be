'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKecamatanDesabinaan extends Model {
        static associate(models) {
            PenyuluhKecamatanDesabinaan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            PenyuluhKecamatanDesabinaan.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    PenyuluhKecamatanDesabinaan.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
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
        tableName: 'penyuluh_kecamatan_desabinaan',
        modelName: 'PenyuluhKecamatanDesabinaan',
        sequelize,
    });

    return PenyuluhKecamatanDesabinaan;
};