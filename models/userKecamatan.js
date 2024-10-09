'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserKecamatan extends Model {
        static associate(models) {
            UserKecamatan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            UserKecamatan.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    UserKecamatan.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        userId: {
            type: DataTypes.BIGINT,
            field: 'user_id',
        },
    }, {
        tableName: 'user_kecamatan',
        modelName: 'UserKecamatan',
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        sequelize,
    });

    return UserKecamatan;
};