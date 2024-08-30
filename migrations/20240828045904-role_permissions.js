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
        await queryInterface.createTable('role_permissions', {
            role_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'roles',
                    key: 'id'
                }
            },
            permission_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'permissions',
                    key: 'id'
                }
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
        await queryInterface.dropTable('role_permissions');
    }
};
