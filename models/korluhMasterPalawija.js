'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhMasterPalawija extends Model {
        static associate(models) {
        }
    }

    KorluhMasterPalawija.init({
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        index: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hide: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        tableName: 'korluh_master_palawija',
        modelName: 'KorluhMasterPalawija',
        sequelize,
    });

    return KorluhMasterPalawija;
};