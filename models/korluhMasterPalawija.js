'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhMasterPalawija extends Model {
        static associate(models) {
            KorluhMasterPalawija.belongsTo(models.KorluhMasterPalawija, {
                foreignKey: 'korluhMasterPalawijaId',
                as: 'induk',
            });
            KorluhMasterPalawija.hasMany(models.KorluhMasterPalawija, {
                foreignKey: 'korluhMasterPalawijaId',
                as: 'anak',
            });
        }
    }

    KorluhMasterPalawija.init({
        korluhMasterPalawijaId: {
            type: DataTypes.BIGINT,
            field: 'korluh_master_palawija_id'
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
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
        tableName: 'korluh_master_palawija',
        modelName: 'KorluhMasterPalawija',
        sequelize,
    });

    return KorluhMasterPalawija;
};