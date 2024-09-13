'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PerkebunanMasterKategoriKomoditas extends Model {
        static associate(models) {
        }
    }

    PerkebunanMasterKategoriKomoditas.init({
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
        tableName: 'perkebunan_master_kategori_komoditas',
        modelName: 'PerkebunanMasterKategoriKomoditas',
        sequelize,
    });

    return PerkebunanMasterKategoriKomoditas;
};