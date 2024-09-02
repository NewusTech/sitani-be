'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('articles', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            judul: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            konten: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            excerpt: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            keyword: {
                type: Sequelize.STRING,
            },
            tag: {
                type: Sequelize.TEXT,
            },
            alt_image: {
                type: Sequelize.STRING,
            },
            created_by: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
        */
        await queryInterface.dropTable('articles');
    }
};
