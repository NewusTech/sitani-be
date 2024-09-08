'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangPedagangEceranList extends Model {
        static associate(models) {
            KepangPedagangEceranList.belongsTo(models.KepangPedagangEceran, {
                foreignKey: 'kepangPedagangEceranId',
                as: 'kepangPedagangEceran',
            });
            KepangPedagangEceranList.belongsTo(models.KepangMasterKomoditas, {
                foreignKey: 'kepangMasterKomoditasId',
                as: 'komoditas',
            });
        }
    }

    KepangPedagangEceranList.init({
        kepangPedagangEceranId: {
            type: DataTypes.BIGINT,
            field: 'kepang_pedagang_eceran_id',
        },
        kepangMasterKomoditasId: {
            type: DataTypes.BIGINT,
            field: 'kepang_master_komoditas_id',
        },

        minggu1: {
            type: DataTypes.INTEGER,
            field: 'minggu_1'
        },
        minggu2: {
            type: DataTypes.INTEGER,
            field: 'minggu_2'
        },
        minggu3: {
            type: DataTypes.INTEGER,
            field: 'minggu_3'
        },
        minggu4: {
            type: DataTypes.INTEGER,
            field: 'minggu_4'
        },
        minggu5: {
            type: DataTypes.INTEGER,
            field: 'minggu_5'
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
        tableName: 'kepang_pedagang_eceran_list',
        modelName: 'KepangPedagangEceranList',
        sequelize,
    });

    return KepangPedagangEceranList;
};