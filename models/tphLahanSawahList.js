'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphLahanSawahList extends Model {
        static associate(models) {
            TphLahanSawahList.belongsTo(models.TphLahanSawah, {
                foreignKey: 'tphLahanSawahId'
            });
            TphLahanSawahList.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
        }
    }

    TphLahanSawahList.init({
        tphLahanSawahId: {
            type: DataTypes.BIGINT,
            field: 'tph_lahan_sawah_id',
        },
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
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
            type: DataTypes.STRING,
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
        tableName: 'tph_lahan_sawah_list',
        modelName: 'TphLahanSawahList',
        sequelize,
    });

    return TphLahanSawahList;
};