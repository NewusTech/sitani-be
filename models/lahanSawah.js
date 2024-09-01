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
            type: DataTypes.DOUBLE,
            field: 'irigasi_teknis',
        },
        irigasiSetengahTeknis: {
            type: DataTypes.DOUBLE,
            field: 'irigasi_setengah_teknis',
        },
        irigasiSederhana: {
            type: DataTypes.DOUBLE,
            field: 'irigasi_sederhana',
        },
        irigasiDesa: {
            type: DataTypes.DOUBLE,
            field: 'irigasi_desa',
        },
        tadahHujan: {
            type: DataTypes.DOUBLE,
            field: 'tadah_hujan',
        },
        pasangSurut: {
            type: DataTypes.DOUBLE,
            field: 'pasang_surut',
        },
        lebak: {
            type: DataTypes.DOUBLE,
        },
        lainnya: {
            type: DataTypes.DOUBLE,
        },
        jumlah: {
            type: DataTypes.DOUBLE,
        },
        keterangan: {
            type: DataTypes.DOUBLE,
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