'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RealisasiPalawija1 extends Model {
        static associate(models) {
            RealisasiPalawija1.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            RealisasiPalawija1.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    RealisasiPalawija1.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        panenKacangHijau: {
            type: DataTypes.DOUBLE,
            field: 'panen_kacang_hijau',
        },
        produktivitasKacangHijau: {
            type: DataTypes.DOUBLE,
            field: 'produksi_kacang_hijau',
        },
        produksiKacangHijau: {
            type: DataTypes.DOUBLE,
            field: 'produksi_kacang_hijau',
        },
        panenUbiKayu: {
            type: DataTypes.DOUBLE,
            field: 'panen_ubi_kayu',
        },
        produktivitasUbiKayu: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_ubi_kayu',
        },
        produksiUbiKayu: {
            type: DataTypes.DOUBLE,
            field: 'produksi_ubi_kayu',
        },
        panenUbiJalar: {
            type: DataTypes.DOUBLE,
            field: 'panen_ubi_jalar',
        },
        produktivitasUbiJalar: {
            type: DataTypes.DOUBLE,
            field: 'produktivitas_ubi_jalar',
        },
        produksiUbiJalar: {
            type: DataTypes.DOUBLE,
            field: 'produksi_ubi_jalar',
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
        tableName: 'realisasi_palawija1',
        modelName: 'RealisasiPalawija1',
        sequelize,
    });

    return RealisasiPalawija1;
};