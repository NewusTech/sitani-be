'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Desa extends Model {
        static associate(models) {
            Desa.belongsTo(models.User, {
                foreignKey: 'kecamatanId'
            });
        }
    }

    Desa.init({
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
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
        tableName: 'master_desa',
        modelName: 'Desa',
        sequelize,
    });

    return Desa;
};