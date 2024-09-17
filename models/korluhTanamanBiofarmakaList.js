'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhTanamanBiofarmakaList extends Model {
        static associate(models) {
            KorluhTanamanBiofarmakaList.belongsTo(models.KorluhTanamanBiofarmaka, {
                foreignKey: 'korluhTanamanBiofarmakaId',
                as: 'korluhTanamanBiofarmaka',
            });
            KorluhTanamanBiofarmakaList.belongsTo(models.KorluhMasterTanamanBiofarmaka, {
                foreignKey: 'korluhMasterTanamanBiofarmakaId',
                as: 'master',
            });
        }
    }

    KorluhTanamanBiofarmakaList.init({
        korluhTanamanBiofarmakaId: {
            type: DataTypes.BIGINT,
            field: 'korluh_tanaman_biofarmaka_id',
        },
        korluhMasterTanamanBiofarmakaId: {
            type: DataTypes.BIGINT,
            field: 'korluh_master_tanaman_biofarmaka_id',
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
        tableName: 'korluh_tanaman_biofarmaka_list',
        modelName: 'KorluhTanamanBiofarmakaList',
        sequelize,
    });

    return KorluhTanamanBiofarmakaList;
};