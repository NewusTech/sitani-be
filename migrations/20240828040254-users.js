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
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
            },
            nip: {
                type: Sequelize.INTEGER,
            },
            pangkat: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('users');
    }
};
