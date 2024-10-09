'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RolePermissions extends Model {
        static associate(models) {
            RolePermissions.belongsTo(models.Role, {
                foreignKey: 'roleId',
                as: 'role',
            });
            RolePermissions.belongsTo(models.Permission, {
                foreignKey: 'permissionId',
                as: 'permission',
            });
        }
    }

    RolePermissions.init({
        roleId: {
            type: DataTypes.BIGINT,
            field: 'role_id',
        },
        permissionId: {
            type: DataTypes.BIGINT,
            field: 'permission_id',
        },
    }, {
        tableName: 'role_permissions',
        modelName: 'RolePermissions',
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        sequelize,
    });

    return RolePermissions;
};