'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Article extends Model {
        static associate(models) {
            Article.belongsTo(models.User, {
                foreignKey: 'createdBy',
                as: 'user',
            });
        }
    }

    Article.init({
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        judul: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        konten: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        excerpt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        keyword: {
            type: DataTypes.STRING,
        },
        tag: {
            type: DataTypes.TEXT,
        },
        altImage: {
            type: DataTypes.STRING,
            field: 'alt_image',
        },
        createdBy: {
            type: DataTypes.BIGINT,
            field: 'created_by',
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
        tableName: 'articles',
        modelName: 'Article',
        sequelize,
    });

    return Article;
};