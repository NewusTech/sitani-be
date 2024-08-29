'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
        }
    }

    Permission.init({
        permissionName: {
            type: DataTypes.STRING(50),
            field: 'permission_name',
            allowNull: false,
            unique: true,
        },
        description: DataTypes.TEXT,
    }, {
        modelName: 'Permission',
        createdAt: false,
        updatedAt: false,
        sequelize,
    });

    return Permission;
};