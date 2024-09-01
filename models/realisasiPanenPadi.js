'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RealisasiPanenPadi extends Model {
        static associate(models) {
            RealisasiPanenPadi.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            RealisasiPanenPadi.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    RealisasiPanenPadi.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        panenSawah: {
            type: DataTypes.DOUBLE,
            field: 'panen_sawah',
        },
        produktivitasSawah: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_sawah',
        },
        produksiSawah: {
            type: DataTypes.DOUBLE,
            field: 'produksi_sawah',
        },
        panenLahanKering: {
            type: DataTypes.DOUBLE,
            field: 'panen_lahan_kering',
        },
        produktivitasLahanKering: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_lahan_kering',
        },
        produksiLahanKering: {
            type: DataTypes.DOUBLE,
            field: 'produksi_lahan_kering',
        },
        panenTotal: {
            type: DataTypes.DOUBLE,
            field: 'panen_total',
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
        tableName: 'realisasi_panen_padi',
        modelName: 'RealisasiPanenPadi',
        sequelize,
    });

    return RealisasiPanenPadi;
};