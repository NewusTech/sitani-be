'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangCvProdusen extends Model {
        static associate(models) {
            KepangCvProdusen.hasMany(models.KepangCvProdusenList, {
                foreignKey: 'kepangCvProdusenId',
                as: 'list'
            });
        }
    }

    KepangCvProdusen.init({
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
        tableName: 'kepang_cv_produsen',
        modelName: 'KepangCvProdusen',
        sequelize,
    });

    return KepangCvProdusen;
};