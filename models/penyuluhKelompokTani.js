'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PenyuluhKelompokTani extends Model {
        static associate(models) {
            PenyuluhKelompokTani.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan'
            });
            PenyuluhKelompokTani.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    PenyuluhKelompokTani.init({
        idPoktan: {
            type: DataTypes.INTEGER,
            field: 'id_poktan'
        },
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
        dibent: {
            type: DataTypes.INTEGER,
        },
        l: {
            type: DataTypes.INTEGER,
        },
        p: {
            type: DataTypes.INTEGER,
        },
        kelas: {
            type: DataTypes.ENUM('p', 'l', 'm', 'u'),
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
        tableName: 'penyuluh_kelompok_tani',
        modelName: 'PenyuluhKelompokTani',
        sequelize,
    });

    return PenyuluhKelompokTani;
};