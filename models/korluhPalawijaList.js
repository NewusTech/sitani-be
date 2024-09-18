'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhPalawijaList extends Model {
        static associate(models) {
            KorluhPalawijaList.belongsTo(models.KorluhPalawija, {
                foreignKey: 'korluhPalawijaId',
                as: 'korluhPalawija',
            });
            KorluhPalawijaList.belongsTo(models.KorluhMasterPalawija, {
                foreignKey: 'korluhMasterPalawijaId',
                as: 'master',
            });
        }
    }

    KorluhPalawijaList.init({
        korluhPalawijaId: {
            type: DataTypes.BIGINT,
            field: 'korluh_palawija_id',
        },
        korluhMasterPalawijaId: {
            type: DataTypes.BIGINT,
            field: 'korluh_master_palawija_id',
        },

        lahanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'lahan_sawah_panen',
        },
        lahanSawahPanenMuda: {
            type: DataTypes.DOUBLE,
            field: 'lahan_sawah_panen_muda',
        },
        lahanSawahPanenHijauanPakanTernak: {
            type: DataTypes.DOUBLE,
            field: 'lahan_sawah_panen_hijauan_pakan_ternak',
        },
        lahanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'lahan_sawah_tanam',
        },
        lahanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'lahan_sawah_puso',
        },

        lahanBukanSawahPanen: {
            type: DataTypes.DOUBLE,
            field: 'lahan_bukan_sawah_panen',
        },
        lahanBukanSawahPanenMuda: {
            type: DataTypes.DOUBLE,
            field: 'lahan_bukan_sawah_panen_muda',
        },
        lahanBukanSawahPanenHijauanPakanTernak: {
            type: DataTypes.DOUBLE,
            field: 'lahan_bukan_sawah_panen_hijauan_pakan_ternak',
        },
        lahanBukanSawahTanam: {
            type: DataTypes.DOUBLE,
            field: 'lahan_bukan_sawah_tanam',
        },
        lahanBukanSawahPuso: {
            type: DataTypes.DOUBLE,
            field: 'lahan_bukan_sawah_puso',
        },
        produksi: {
            type: DataTypes.DOUBLE,
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
        tableName: 'korluh_palawija_list',
        modelName: 'KorluhPalawijaList',
        sequelize,
    });

    return KorluhPalawijaList;
};