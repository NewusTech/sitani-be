'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
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
        modelName: 'Role',
        createdAt: false,
        updatedAt: false,
        sequelize,
    });

    return Role;
};