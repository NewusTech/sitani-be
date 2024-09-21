'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PerkebunanMasterKomoditas extends Model {
        static associate(models) {
            PerkebunanMasterKomoditas.belongsTo(models.PerkebunanMasterKategoriKomoditas, {
                foreignKey: 'perkebunanMasterKategoriId',
                as: 'kategori'
            });
        }
    }

    PerkebunanMasterKomoditas.init({
        perkebunanMasterKategoriId: {
            type: DataTypes.BIGINT,
            field: 'perkebunan_master_kategori_id'
        },
        nama: {
            type: DataTypes.STRING,
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
        tableName: 'perkebunan_master_komoditas',
        modelName: 'PerkebunanMasterKomoditas',
        sequelize,
    });

    return PerkebunanMasterKomoditas;
};