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
        await queryInterface.createTable('korluh_master_sayur_dan_buah', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            nama: {
                type: Sequelize.STRING,
                allowNull: false,
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

        await queryInterface.addConstraint('korluh_sayur_dan_buah_list', {
            fields: ['korluh_master_sayur_dan_buah_id'],
            name: 'fk_master_sayur_buah_id',
            type: 'foreign key',
            references: {
                table: 'korluh_master_sayur_dan_buah',
                field: 'id'
            }
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeConstraint('korluh_sayur_dan_buah_list', 'fk_master_sayur_buah_id');

        await queryInterface.dropTable('korluh_master_sayur_dan_buah');
    }
};
