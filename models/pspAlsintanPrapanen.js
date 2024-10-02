'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PspAlsintanPrapanen extends Model {
        static associate(models) {
            PspAlsintanPrapanen.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
        }
    }

    PspAlsintanPrapanen.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },

        tahun: {
            type: DataTypes.INTEGER,
        },

        tr_4_apbn: {
            type: DataTypes.INTEGER,
        },
        tr_4_tp: {
            type: DataTypes.INTEGER,
        },
        tr_4_apbd: {
            type: DataTypes.INTEGER,
        },

        tr_2_apbn: {
            type: DataTypes.INTEGER,
        },
        tr_2_tp: {
            type: DataTypes.INTEGER,
        },
        tr_2_apbd: {
            type: DataTypes.INTEGER,
        },

        rt_apbn: {
            type: DataTypes.INTEGER,
        },
        rt_tp: {
            type: DataTypes.INTEGER,
        },
        rt_apbd: {
            type: DataTypes.INTEGER,
        },

        cornplanter_apbn: {
            type: DataTypes.INTEGER,
        },
        cornplanter_tp: {
            type: DataTypes.INTEGER,
        },
        cornplanter_apbd: {
            type: DataTypes.INTEGER,
        },

        cultivator_apbn: {
            type: DataTypes.INTEGER,
        },
        cultivator_tp: {
            type: DataTypes.INTEGER,
        },
        cultivator_apbd: {
            type: DataTypes.INTEGER,
        },

        hand_sprayer_apbn: {
            type: DataTypes.INTEGER,
        },
        hand_sprayer_tp: {
            type: DataTypes.INTEGER,
        },
        hand_sprayer_apbd: {
            type: DataTypes.INTEGER,
        },

        pompa_air_apbn: {
            type: DataTypes.INTEGER,
        },
        pompa_air_tp: {
            type: DataTypes.INTEGER,
        },
        pompa_air_apbd: {
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
        tableName: 'psp_alsintan_prapanen',
        modelName: 'PspAlsintanPrapanen',
        sequelize,
    });

    return PspAlsintanPrapanen;
};