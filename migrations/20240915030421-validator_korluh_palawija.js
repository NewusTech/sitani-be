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
        await queryInterface.createTable('validator_korluh_palawija', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            validasi_korluh_palawija_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'validasi_korluh_palawija',
                    key: 'id'
                }
            },
            validator_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            email: {
                type: Sequelize.STRING(100),
            },
            nip: {
                type: Sequelize.STRING(20),
            },
            name: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM('tolak', 'terima'),
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
        await queryInterface.dropTable('validator_korluh_palawija');
    }
};
