'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhSayurBuahList extends Model {
        static associate(models) {
            KorluhSayurBuahList.belongsTo(models.KorluhSayurBuah, {
                foreignKey: 'korluhSayurBuahId',
                as: 'korluhSayurBuah',
            });
            KorluhSayurBuahList.belongsTo(models.KorluhMasterSayurBuah, {
                foreignKey: 'korluhMasterSayurBuahId',
                as: 'master',
            });
        }
    }

    KorluhSayurBuahList.init({
        korluhSayurBuahId: {
            type: DataTypes.BIGINT,
            field: 'korluh_sayur_dan_buah_id',
        },
        korluhMasterSayurBuahId: {
            type: DataTypes.BIGINT,
            field: 'korluh_master_sayur_dan_buah_id',
        },

        hasilProduksi: {
            type: DataTypes.STRING,
            field: 'hasil_produksi',
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
        tableName: 'korluh_sayur_dan_buah_list',
        modelName: 'KorluhSayurBuahList',
        sequelize,
    });

    return KorluhSayurBuahList;
};