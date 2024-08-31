'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterKecamatan extends Model {
        static associate(models) {
        }
    }

    MasterKecamatan.init({
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
        tableName: 'master_kecamatan',
        modelName: 'MasterKecamatan',
        sequelize,
    });

    return MasterKecamatan;
};