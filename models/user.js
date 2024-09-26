'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsToMany(models.Role, {
                through: 'user_roles',
                foreignKey: 'user_id',
                otherKey: 'role_id',
                timestamps: false,
                as: 'roles',
            });
            User.belongsToMany(models.Kecamatan, {
                through: 'user_kecamatan',
                foreignKey: 'user_id',
                otherKey: 'kecamatan_id',
                timestamps: false,
                as: 'kecamatans',
            });
            User.belongsToMany(models.Desa, {
                through: 'user_kecamatan_desa',
                foreignKey: 'user_id',
                otherKey: 'desa_id',
                timestamps: false,
                as: 'desas',
            });
        }
    }

    User.init({
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        nip: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        name: DataTypes.STRING,
        pangkat: DataTypes.STRING,
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
        tableName: 'users',
        modelName: 'User',
        sequelize,
    });

    return User;
};