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
        await queryInterface.createTable('perkebunan_kecamatan_list', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            perkebunan_kecamatan_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'perkebunan_kecamatan',
                    key: 'id'
                }
            },
            master_kategori_komoditas_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'perkebunan_master_kategori_komoditas',
                    key: 'id'
                }
            },
            master_komoditas_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'kepang_master_komoditas',
                    key: 'id'
                }
            },

            tbm: {
                type: Sequelize.DOUBLE,
            },
            tm: {
                type: Sequelize.DOUBLE,
            },
            tr: {
                type: Sequelize.DOUBLE,
            },
            jumlah: {
                type: Sequelize.DOUBLE,
            },
            produksi: {
                type: Sequelize.DOUBLE,
            },
            produktivitas: {
                type: Sequelize.DOUBLE,
            },
            jml_petani_pekebun: {
                type: Sequelize.DOUBLE,
            },
            bentuk_hasil: {
                type: Sequelize.STRING,
            },
            keterangan: {
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
        await queryInterface.dropTable('perkebunan_kecamatan_list');
    }
};
