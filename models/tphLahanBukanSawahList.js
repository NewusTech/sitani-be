'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphLahanBukanSawahList extends Model {
        static associate(models) {
            TphLahanBukanSawahList.belongsTo(models.TphLahanBukanSawah, {
                foreignKey: 'tphLahanBukanSawahId',
                as: 'tphLahanBukanSawah'
            });
            TphLahanBukanSawahList.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
        }
    }

    TphLahanBukanSawahList.init({
        tphLahanBukanSawahId: {
            type: DataTypes.BIGINT,
            field: 'tph_lahan_bukan_sawah_id',
        },
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },

        tegal: {
            type: DataTypes.DOUBLE,
        },
        ladang: {
            type: DataTypes.DOUBLE,
        },
        perkebunan: {
            type: DataTypes.DOUBLE,
        },
        hutanRakyat: {
            type: DataTypes.DOUBLE,
            field: 'hutan_rakyat',
        },
        padangPengembalaanRumput: {
            type: DataTypes.DOUBLE,
            field: 'padang_pengembalaan_rumput',
        },
        hutanNegara: {
            type: DataTypes.DOUBLE,
            field: 'hutan_negara',
        },
        smtTidakDiusahakan: {
            type: DataTypes.DOUBLE,
            field: 'smt_tidak_diusahakan',
        },
        lainnya: {
            type: DataTypes.DOUBLE,
        },
        jumlahLahanBukanSawah: {
            type: DataTypes.DOUBLE,
            field: 'jumlah_lahan_bukan_sawah',
        },
        lahanBukanPertanian: {
            type: DataTypes.DOUBLE,
            field: 'lahan_bukan_pertanian',
        },
        total: {
            type: DataTypes.DOUBLE,
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
        tableName: 'tph_lahan_bukan_sawah_list',
        modelName: 'TphLahanBukanSawahList',
        sequelize,
    });

    return TphLahanBukanSawahList;
};