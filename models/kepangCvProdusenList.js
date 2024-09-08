'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KepangCvProdusenList extends Model {
        static associate(models) {
            KepangCvProdusenList.belongsTo(models.KepangCvProdusen, {
                foreignKey: 'kepangCvProdusenId',
                as: 'kepangCvProdusen',
            });
            KepangCvProdusenList.belongsTo(models.KepangMasterKomoditas, {
                foreignKey: 'kepangMasterKomoditasId',
                as: 'komoditas',
            });
        }
    }

    KepangCvProdusenList.init({
        kepangCvProdusenId: {
            type: DataTypes.BIGINT,
            field: 'kepang_cv_produsen_id',
        },
        kepangMasterKomoditasId: {
            type: DataTypes.BIGINT,
            field: 'kepang_master_komoditas_id',
        },

        nilai: {
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
        tableName: 'kepang_cv_produsen_list',
        modelName: 'KepangCvProdusenList',
        sequelize,
    });

    return KepangCvProdusenList;
};