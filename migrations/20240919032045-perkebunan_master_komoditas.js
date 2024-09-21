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
        await queryInterface.createTable('perkebunan_master_komoditas', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            perkebunan_master_kategori_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'perkebunan_master_kategori_komoditas',
                    key: 'id'
                }
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

        await queryInterface.addConstraint('perkebunan_kecamatan_list', {
            fields: ['master_komoditas_id'],
            name: 'fk_perkebunan_master_komoditas_id',
            type: 'foreign key',
            references: {
                table: 'perkebunan_master_komoditas',
                field: 'id',
            }
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeConstraint('perkebunan_kecamatan_list', 'fk_perkebunan_master_komoditas_id');

        await queryInterface.dropTable('perkebunan_master_komoditas');
    }
};
