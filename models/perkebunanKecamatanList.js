'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PerkebunanKecamatanList extends Model {
        static associate(models) {
            PerkebunanKecamatanList.belongsTo(models.PerkebunanKecamatan, {
                foreignKey: 'perkebunanKecamatanId',
                as: 'perkebunanKecamatan'
            });
            PerkebunanKecamatanList.belongsTo(models.PerkebunanMasterKategoriKomoditas, {
                foreignKey: 'masterKategoriKomoditasId',
                as: 'kategoriKomoditas',
            });
            PerkebunanKecamatanList.belongsTo(models.KepangMasterKomoditas, {
                foreignKey: 'masterKomoditasId',
                as: 'komoditas'
            });
        }
    }

    PerkebunanKecamatanList.init({
        perkebunanKecamatanId: {
            type: DataTypes.BIGINT,
            field: 'perkebunan_kecamatan_id',
        },
        masterKategoriKomoditasId: {
            type: DataTypes.BIGINT,
            field: 'master_kategori_komoditas_id',
        },
        masterKomoditasId: {
            type: DataTypes.BIGINT,
            field: 'master_komoditas_id'
        },

        tbm: {
            type: DataTypes.DOUBLE,
        },
        tm: {
            type: DataTypes.DOUBLE,
        },
        tr: {
            type: DataTypes.DOUBLE,
        },
        jumlah: {
            type: DataTypes.DOUBLE,
        },
        produksi: {
            type: DataTypes.DOUBLE,
        },
        produktivitas: {
            type: DataTypes.DOUBLE,
        },
        jmlPetaniPekebun: {
            type: DataTypes.DOUBLE,
            field: 'jml_petani_pekebun'
        },
        bentukHasil: {
            type: DataTypes.STRING,
            field: 'bentuk_hasil'
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
        tableName: 'perkebunan_kecamatan_list',
        modelName: 'PerkebunanKecamatanList',
        sequelize,
    });

    return PerkebunanKecamatanList;
};