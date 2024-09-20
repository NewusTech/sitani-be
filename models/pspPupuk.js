'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PspPupuk extends Model {
        static associate(models) {
        }
    }

    PspPupuk.init({
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        jenisPupuk: {
            type: DataTypes.STRING,
            field: 'jenis_pupuk',
            allowNull: false,
        },
        kandunganPupuk: {
            type: DataTypes.STRING,
            field: 'kandungan_pupuk',
            allowNull: false,
        },
        keterangan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hargaPupuk: {
            type: DataTypes.INTEGER,
            field: 'harga_pupuk',
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
        tableName: 'psp_pupuk',
        modelName: 'PspPupuk',
        sequelize,
    });

    return PspPupuk;
};