'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhTanamanHiasList extends Model {
        static associate(models) {
            KorluhTanamanHiasList.belongsTo(models.KorluhTanamanHias, {
                foreignKey: 'korluhTanamanHiasId',
                as: 'korluhTanamanHias',
            });
        }
    }

    KorluhTanamanHiasList.init({
        korluhTanamanHiasId: {
            type: DataTypes.BIGINT,
            field: 'korluh_tanaman_hias_id',
        },

        namaTanaman: {
            type: DataTypes.STRING,
            field: 'nama_tanaman',
            allowNull: false,
        },
        luasPanenHabis: {
            type: DataTypes.DOUBLE,
            field: 'luas_panen_habis'
        },
        luasPanenBelumHabis: {
            type: DataTypes.DOUBLE,
            field: 'luas_panen_belum_habis',
        },
        luasRusak: {
            type: DataTypes.DOUBLE,
            field: 'luas_rusak',
        },
        luasPenanamanBaru: {
            type: DataTypes.DOUBLE,
            field: 'luas_penanaman_baru',
        },
        produksiHabis: {
            type: DataTypes.DOUBLE,
            field: 'produksi_habis'
        },
        produksiBelumHabis: {
            type: DataTypes.DOUBLE,
            field: 'produksi_belum_habis',
        },
        satuanProduksi: {
            type: DataTypes.STRING,
            field: 'satuan_produksi',
        },
        rerataHarga: {
            type: DataTypes.INTEGER,
            field: 'rerata_harga',
        },
        keterangan: {
            type: DataTypes.STRING,
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
        tableName: 'korluh_tanaman_hias_list',
        modelName: 'KorluhTanamanHiasList',
        sequelize,
    });

    return KorluhTanamanHiasList;
};