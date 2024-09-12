'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TphRealisasiPadiList extends Model {
        static associate(models) {
            TphRealisasiPadiList.belongsTo(models.TphRealisasiPadi, {
                foreignKey: 'tphRealisasiPadiId',
                as: 'tphRealisasiPadi'
            });
            TphRealisasiPadiList.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
        }
    }

    TphRealisasiPadiList.init({
        tphRealisasiPadiId: {
            type: DataTypes.BIGINT,
            field: 'tph_realisasi_padi_id',
        },
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },

        panenLahanSawah: {
            type: DataTypes.DOUBLE,
            field: 'panen_lahan_sawah',
        },
        produktivitasLahanSawah: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_lahan_sawah'
        },
        produksiLahanSawah: {
            type: DataTypes.DOUBLE,
            field: 'produksi_lahan_sawah'
        },
        panenLahanKering: {
            type: DataTypes.DOUBLE,
            field: 'panen_lahan_kering',
        },
        produktivitasLahanKering: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_lahan_kering'
        },
        produksiLahanKering: {
            type: DataTypes.DOUBLE,
            field: 'produksi_lahan_kering'
        },
        panenTotal: {
            type: DataTypes.DOUBLE,
            field: 'panen_total'
        },
        produktivitasTotal: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_total',
        },
        produksiTotal: {
            type: DataTypes.DOUBLE,
            field: 'produksi_total',
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
        tableName: 'tph_realisasi_padi_list',
        modelName: 'TphRealisasiPadiList',
        sequelize,
    });

    return TphRealisasiPadiList;
};