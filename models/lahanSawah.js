'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LahanSawah extends Model {
        static associate(models) {
            LahanSawah.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            LahanSawah.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    LahanSawah.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        irigasiTeknis: {
            type: DataTypes.INTEGER,
            field: 'irigasi_teknis',
        },
        irigasiSetengahTeknis: {
            type: DataTypes.INTEGER,
            field: 'irigasi_setengah_teknis',
        },
        irigasiSederhana: {
            type: DataTypes.INTEGER,
            field: 'irigasi_sederhana',
        },
        irigasiDesa: {
            type: DataTypes.INTEGER,
            field: 'irigasi_desa',
        },
        tadahHujan: {
            type: DataTypes.INTEGER,
            field: 'tadah_hujan',
        },
        pasangSurut: {
            type: DataTypes.INTEGER,
            field: 'pasang_surut',
        },
        lebak: {
            type: DataTypes.INTEGER,
        },
        lainnya: {
            type: DataTypes.INTEGER,
        },
        jumlah: {
            type: DataTypes.INTEGER,
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
        tableName: 'lahan_sawah',
        modelName: 'LahanSawah',
        sequelize,
    });

    return LahanSawah;
};