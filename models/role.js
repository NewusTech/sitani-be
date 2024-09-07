'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsToMany(models.Permission, {
                through: 'role_permissions',
                otherKey: 'permission_id',
                foreignKey: 'role_id',
                timestamps: false,
                as: 'permissions',
            });
        }
    }

    Role.init({
        roleName: {
            type: DataTypes.STRING(50),
            field: 'role_name',
            allowNull: false,
            unique: true,
        },
        description: DataTypes.TEXT,
    }, {
        tableName: 'roles',
        modelName: 'Role',
        createdAt: false,
        updatedAt: false,
        sequelize,
    });

    return Role;
};