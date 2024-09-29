'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PspAlsintanPascapanen extends Model {
        static associate(models) {
            PspAlsintanPascapanen.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
        }
    }

    PspAlsintanPascapanen.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },

        tahun: {
            type: DataTypes.INTEGER,
        },

        chb_apbn: {
            type: DataTypes.INTEGER,
        },
        chb_tp: {
            type: DataTypes.INTEGER,
        },
        chb_apbd: {
            type: DataTypes.INTEGER,
        },

        chk_apbn: {
            type: DataTypes.INTEGER,
        },
        chk_tp: {
            type: DataTypes.INTEGER,
        },
        chk_apbd: {
            type: DataTypes.INTEGER,
        },

        power_thresher_apbn: {
            type: DataTypes.INTEGER,
        },
        power_thresher_tp: {
            type: DataTypes.INTEGER,
        },
        power_thresher_apbd: {
            type: DataTypes.INTEGER,
        },

        corn_sheller_apbn: {
            type: DataTypes.INTEGER,
        },
        corn_sheller_tp: {
            type: DataTypes.INTEGER,
        },
        corn_sheller_apbd: {
            type: DataTypes.INTEGER,
        },

        ptm_apbn: {
            type: DataTypes.INTEGER,
        },
        ptm_tp: {
            type: DataTypes.INTEGER,
        },
        ptm_apbd: {
            type: DataTypes.INTEGER,
        },

        ptm_mobile_apbn: {
            type: DataTypes.INTEGER,
        },
        ptm_mobile_tp: {
            type: DataTypes.INTEGER,
        },
        ptm_mobile_apbd: {
            type: DataTypes.INTEGER,
        },

        cs_mobile_apbn: {
            type: DataTypes.INTEGER,
        },
        cs_mobile_tp: {
            type: DataTypes.INTEGER,
        },
        cs_mobile_apbd: {
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
        tableName: 'psp_alsintan_pascapanen',
        modelName: 'PspAlsintanPascapanen',
        sequelize,
    });

    return PspAlsintanPascapanen;
};