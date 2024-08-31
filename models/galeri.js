'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Galeri extends Model {
        static associate(models) {
        }
    }

    Galeri.init({
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deskripsi: {
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
        tableName: 'galeri',
        modelName: 'Galeri',
        sequelize,
    });

    return Galeri;
};