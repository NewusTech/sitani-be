'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangMasterKomoditas extends Model {
        static associate(models) {
        }
    }

    KepangMasterKomoditas.init({
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
        tableName: 'kepang_master_komoditas',
        modelName: 'KepangMasterKomoditas',
        sequelize,
    });

    return KepangMasterKomoditas;
};