'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PerkebunanKecamatan extends Model {
        static associate(models) {
            PerkebunanKecamatan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
            PerkebunanKecamatan.hasMany(models.PerkebunanKecamatanList, {
                foreignKey: 'perkebunanKecamatanId',
                as: 'list'
            });
        }
    }

    PerkebunanKecamatan.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id'
        },
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'perkebunan_kecamatan',
        modelName: 'PerkebunanKecamatan',
        sequelize,
    });

    return PerkebunanKecamatan;
};