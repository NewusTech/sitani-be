'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Kepegawaian extends Model {
        static associate(models) {
        }
    }

    Kepegawaian.init({
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nip: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tempatLahir: {
            type: DataTypes.STRING,
            field: 'tempat_lahir',
            allowNull: false,
        },
        tglLahir: {
            type: DataTypes.STRING,
            field: 'tgl_lahir',
            allowNull: false,
        },
        pangkat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        golongan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tmtPangkat: {
            type: DataTypes.DATE,
            field: 'tmt_pangkat',
            allowNull: false,
        },
        jabatan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tmtJabatan: {
            type: DataTypes.DATE,
            field: 'tmt_jabatan',
            allowNull: false,
        },
        namaDiklat: {
            type: DataTypes.STRING,
            field: 'nama_diklat',
        },
        tglDiklat: {
            type: DataTypes.DATE,
            field: 'tgl_diklat',
            allowNull: false,
        },
        totalJam: {
            type: DataTypes.INTEGER,
            field: 'total_jam',
            allowNull: false,
        },
        namaPendidikan: {
            type: DataTypes.STRING,
            field: 'nama_pendidikan',
            allowNull: false,
        },
        tahunLulus: {
            type: DataTypes.INTEGER,
            field: 'tahun_lulus',
            allowNull: false,
        },
        jenjangPendidikan: {
            type: DataTypes.STRING,
            field: 'jenjang_pendidikan',
            allowNull: false,
        },
        usia: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        masaKerja: {
            type: DataTypes.STRING,
            field: 'masa_kerja',
            allowNull: false,
        },
        keterangan: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: 'master_kepegawaian',
        modelName: 'Kepegawaian',
        sequelize,
    });

    return Kepegawaian;
};