'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangProdusenEceranList extends Model {
        static associate(models) {
            KepangProdusenEceranList.belongsTo(models.KepangProdusenEceran, {
                foreignKey: 'kepangProdusenEceranId',
                as: 'kepangProdusenEceran',
            });
            KepangProdusenEceranList.belongsTo(models.KepangMasterKomoditas, {
                foreignKey: 'kepangMasterKomoditasId',
                as: 'komoditas',
            });
        }
    }

    KepangProdusenEceranList.init({
        kepangProdusenEceranId: {
            type: DataTypes.BIGINT,
            field: 'kepang_produsen_dan_eceran_id',
        },
        kepangMasterKomoditasId: {
            type: DataTypes.BIGINT,
            field: 'kepang_master_komoditas_id',
        },

        satuan: {
            type: DataTypes.STRING,
        },
        harga: {
            type: DataTypes.INTEGER,
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
        tableName: 'kepang_produsen_dan_eceran_list',
        modelName: 'KepangProdusenEceranList',
        sequelize,
    });

    return KepangProdusenEceranList;
};