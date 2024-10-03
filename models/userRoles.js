'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserRoles extends Model {
        static associate(models) {
            UserRoles.belongsTo(models.Role, {
                foreignKey: 'roleId',
                as: 'role',
            });
            UserRoles.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    UserRoles.init({
        roleId: {
            type: DataTypes.BIGINT,
            field: 'role_id',
        },
        userId: {
            type: DataTypes.BIGINT,
            field: 'user_id',
        },
    }, {
        tableName: 'user_roles',
        modelName: 'UserRoles',
        updatedAt: false,
        deletedAt: false,
        sequelize,
    });

    return UserRoles;
};