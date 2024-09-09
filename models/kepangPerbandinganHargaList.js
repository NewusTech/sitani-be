'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangPerbandinganHargaList extends Model {
        static associate(models) {
            KepangPerbandinganHargaList.belongsTo(models.KepangPerbandinganHarga, {
                foreignKey: 'kepangPerbandinganHargaId',
                as: 'kepangPerbandinganHarga',
            });
            KepangPerbandinganHargaList.belongsTo(models.KepangMasterKomoditas, {
                foreignKey: 'kepangMasterKomoditasId',
                as: 'komoditas',
            });
        }
    }

    KepangPerbandinganHargaList.init({
        kepangPerbandinganHargaId: {
            type: DataTypes.BIGINT,
            field: 'kepang_perbandingan_harga_id',
        },
        kepangMasterKomoditasId: {
            type: DataTypes.BIGINT,
            field: 'kepang_master_komoditas_id',
        },

        harga: {
            type: DataTypes.INTEGER,
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
        tableName: 'kepang_perbandingan_harga_list',
        modelName: 'KepangPerbandinganHargaList',
        sequelize,
    });

    return KepangPerbandinganHargaList;
};