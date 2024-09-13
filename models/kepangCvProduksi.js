'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangCvProduksi extends Model {
        static associate(models) {
        }
    }

    KepangCvProduksi.init({
        bulan: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        panen: {
            type: DataTypes.DOUBLE,
        },
        gkpTkPetani: {
            type: DataTypes.INTEGER,
            field: 'gkp_tk_petani'
        },
        gkpTkPenggilingan: {
            type: DataTypes.INTEGER,
            field: 'gkp_tk_penggilingan'
        },
        gkgTkPenggilingan: {
            type: DataTypes.INTEGER,
            field: 'gkg_tk_penggilingan'
        },
        jpk: {
            type: DataTypes.INTEGER,
        },
        cabaiMerahKeriting: {
            type: DataTypes.INTEGER,
            field: 'cabai_merah_keriting',
        },
        berasMedium: {
            type: DataTypes.INTEGER,
            field: 'beras_medium'
        },
        berasPremium: {
            type: DataTypes.INTEGER,
            field: 'beras_premium',
        },
        stokGkg: {
            type: DataTypes.INTEGER,
            field: 'stok_gkg'
        },
        stokBeras: {
            type: DataTypes.INTEGER,
            field: 'stok_beras',
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
        tableName: 'kepang_cv_produksi',
        modelName: 'KepangCvProduksi',
        sequelize,
    });

    return KepangCvProduksi;
};