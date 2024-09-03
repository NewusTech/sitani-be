'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PspBantuan extends Model {
        static associate(models) {
            PspBantuan.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId'
            });
            PspBantuan.belongsTo(models.Desa, {
                foreignKey: 'desaId'
            });
        }
    }

    PspBantuan.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        jenisBantuan: {
            type: DataTypes.STRING,
            field: 'jenis_bantuan',
            allowNull: false,
        },
        periode: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        keterangan: {
            type: DataTypes.STRING,
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
        tableName: 'psp_bantuan',
        modelName: 'PspBantuan',
        sequelize,
    });

    return PspBantuan;
};