'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('master_kepegawaian', 'nip', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tempat_lahir', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tgl_lahir', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'pangkat', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'golongan', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tmt_pangkat', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'jabatan', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tmt_jabatan', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'nama_diklat', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tgl_diklat', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'total_jam', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'nama_pendidikan', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tahun_lulus', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'jenjang_pendidikan', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'usia', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'masa_kerja', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'keterangan', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('master_kepegawaian', 'nip', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tempat_lahir', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tgl_lahir', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'pangkat', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'golongan', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tmt_pangkat', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'jabatan', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tmt_jabatan', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'nama_diklat', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tgl_diklat', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'total_jam', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'nama_pendidikan', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'tahun_lulus', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'jenjang_pendidikan', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'usia', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'masa_kerja', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('master_kepegawaian', 'keterangan', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
