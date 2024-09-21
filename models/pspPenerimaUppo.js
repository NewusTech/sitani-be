'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PspPenerimaUppo extends Model {
        static associate(models) {
            PspPenerimaUppo.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
            PspPenerimaUppo.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    PspPenerimaUppo.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        tahun: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        namaPoktan: {
            type: DataTypes.STRING,
            field: 'nama_poktan',
            allowNull: false,
        },
        ketuaPoktan: {
            type: DataTypes.STRING,
            field: 'ketua_poktan',
            allowNull: false,
        },
        titikKoordinat: {
            type: DataTypes.STRING,
            field: 'titik_koordinat',
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
        tableName: 'psp_penerima_uppo',
        modelName: 'PspPenerimaUppo',
        sequelize,
    });

    return PspPenerimaUppo;
};