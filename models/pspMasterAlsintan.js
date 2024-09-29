'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PspMasterAlsintan extends Model {
        static associate(models) {
        }
    }

    PspMasterAlsintan.init({
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
        tableName: 'psp_master_alsintan',
        modelName: 'PspMasterAlsintan',
        sequelize,
    });

    return PspMasterAlsintan;
};