'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhMasterTanamanHias extends Model {
        static associate(models) {
        }
    }

    KorluhMasterTanamanHias.init({
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
        tableName: 'korluh_master_tanaman_hias',
        modelName: 'KorluhMasterTanamanHias',
        sequelize,
    });

    return KorluhMasterTanamanHias;
};