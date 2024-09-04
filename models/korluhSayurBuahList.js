'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhSayurBuahList extends Model {
        static associate(models) {
            KorluhSayurBuahList.belongsTo(models.KorluhSayurBuah, {
                foreignKey: 'sayurBuahId'
            });
        }
    }

    KorluhSayurBuahList.init({
        sayurBuahId: {
            type: DataTypes.BIGINT,
            field: 'sayur_dan_buah_id',
        },

        namaTanaman: {
            type: DataTypes.STRING,
            field: 'nama_tanaman',
            allowNull: false,
        },
        hasilProduksi: {
            type: DataTypes.STRING,
            field: 'hasil_produksi',
            allowNull: false,
        },
        
        luasPanenHabis: {
            type: DataTypes.DOUBLE,
            field: 'luas_panen_habis',
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
            field: 'produksi_habis',
        },
        produksiBelumHabis: {
            type: DataTypes.DOUBLE,
            field: 'produksi_belum_habis',
        },

        rerataHargaJual: {
            type: DataTypes.INTEGER,
            field: 'rerata_harga_jual',
        },
        keterangan: {
            type: DataTypes.STRING
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
        tableName: 'korluh_sayur_dan_buah_list',
        modelName: 'KorluhSayurBuahList',
        sequelize,
    });

    return KorluhSayurBuahList;
};