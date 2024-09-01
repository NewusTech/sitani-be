'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RealisasiPalawija2 extends Model {
        static associate(models) {
            RealisasiPalawija2.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            RealisasiPalawija2.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    RealisasiPalawija2.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        panenJagung: {
            type: DataTypes.DOUBLE,
            field: 'panen_jagung',
        },
        produktivitasJagung: {
            type: DataTypes.DOUBLE,
            field: 'produksi_jagung',
        },
        produksiJagung: {
            type: DataTypes.DOUBLE,
            field: 'produksi_jagung',
        },
        panenKedelai: {
            type: DataTypes.DOUBLE,
            field: 'panen_kedelai',
        },
        produktivitasKedelai: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_kedelai',
        },
        produksiKedelai: {
            type: DataTypes.DOUBLE,
            field: 'produksi_kedelai',
        },
        panenKacangTanah: {
            type: DataTypes.DOUBLE,
            field: 'panen_kacang_tanah',
        },
        produktivitasKacangTanah: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_kacang_tanah',
        },
        produksiKacangTanah: {
            type: DataTypes.DOUBLE,
            field: 'produksi_kacang_tanah',
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
        tableName: 'realisasi_palawija2',
        modelName: 'RealisasiPalawija2',
        sequelize,
    });

    return RealisasiPalawija2;
};