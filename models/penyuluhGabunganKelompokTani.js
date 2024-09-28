'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhGabunganKelompokTani extends Model {
        static associate(models) {
            PenyuluhGabunganKelompokTani.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
            PenyuluhGabunganKelompokTani.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    PenyuluhGabunganKelompokTani.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id'
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id'
        },
        tahun: {
            type: DataTypes.INTEGER,
        },
        nama: {
            type: DataTypes.STRING,
        },
        ketua: {
            type: DataTypes.STRING,
        },
        sekretaris: {
            type: DataTypes.STRING,
        },
        bendahara: {
            type: DataTypes.STRING,
        },
        alamat: {
            type: DataTypes.STRING,
        },
        lahan: {
            type: DataTypes.DOUBLE,
        },
        dibentuk: {
            type: DataTypes.INTEGER,
        },
        poktan: {
            type: DataTypes.INTEGER,
        },
        l: {
            type: DataTypes.INTEGER,
        },
        p: {
            type: DataTypes.INTEGER,
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
        tableName: 'penyuluh_gabungan_kelompok_tani',
        modelName: 'PenyuluhGabunganKelompokTani',
        sequelize,
    });

    return PenyuluhGabunganKelompokTani;
};