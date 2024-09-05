'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Bidang extends Model {
        static associate(models) {
        }
    }

    Bidang.init({
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        tableName: 'master_bidang',
        modelName: 'Bidang',
        sequelize,
    });

    return Bidang;
};