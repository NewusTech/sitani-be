'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangPerbandinganHarga extends Model {
        static associate(models) {
            KepangPerbandinganHarga.hasMany(models.KepangPerbandinganHargaList, {
                foreignKey: 'kepangPerbandinganHargaId',
                as: 'list'
            });
        }
    }

    KepangPerbandinganHarga.init({
        bulan: {
            type: DataTypes.DATE,
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
        tableName: 'kepang_perbandingan_harga',
        modelName: 'KepangPerbandinganHarga',
        sequelize,
    });

    return KepangPerbandinganHarga;
};