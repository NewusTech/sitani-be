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
            type: DataTypes.INTEGER,
        },
        ladang: {
            type: DataTypes.INTEGER,
        },
        perkebunan: {
            type: DataTypes.INTEGER,
        },
        hutanRakyat: {
            type: DataTypes.INTEGER,
            field: 'hutan_rakyat',
        },
        padangRumput: {
            type: DataTypes.INTEGER,
            field: 'padang_rumput',
        },
        hutanNegara: {
            type: DataTypes.INTEGER,
            field: 'hutan_negara',
        },
        smtTidakdiusahakan: {
            type: DataTypes.INTEGER,
            field: 'smt_tidakdiusahakan',
        },
        lainnya: {
            type: DataTypes.INTEGER,
        },
        jmlLahanBukanSawah: {
            type: DataTypes.INTEGER,
            field: 'jml_lahan_bukan_sawah',
        },
        jalanPermukimanPerkantoran: {
            type: DataTypes.INTEGER,
            field: 'jalan_permukiman_perkantoran',
        },
        total: {
            type: DataTypes.INTEGER,
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