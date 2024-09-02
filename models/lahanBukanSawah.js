'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LahanBukanSawah extends Model {
        static associate(models) {
            LahanBukanSawah.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            LahanBukanSawah.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    LahanBukanSawah.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
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
        padangRumput: {
            type: DataTypes.DOUBLE,
            field: 'padang_rumput',
        },
        hutanNegara: {
            type: DataTypes.DOUBLE,
            field: 'hutan_negara',
        },
        smtTidakdiusahakan: {
            type: DataTypes.DOUBLE,
            field: 'smt_tidakdiusahakan',
        },
        lainnya: {
            type: DataTypes.DOUBLE,
        },
        jmlLahanBukanSawah: {
            type: DataTypes.DOUBLE,
            field: 'jml_lahan_bukan_sawah',
        },
        jalanPermukimanPerkantoran: {
            type: DataTypes.DOUBLE,
            field: 'jalan_permukiman_perkantoran',
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
        tableName: 'lahan_bukan_sawah',
        modelName: 'LahanBukanSawah',
        sequelize,
    });

    return LahanBukanSawah;
};