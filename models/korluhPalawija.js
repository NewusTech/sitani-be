'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhPalawija extends Model {
        static associate(models) {
            KorluhPalawija.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            KorluhPalawija.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
            KorluhPalawija.hasMany(models.KorluhPalawijaList, {
                foreignKey: 'korluhPalawijaId',
                as: 'list'
            });
        }
    }

    KorluhPalawija.init({
        kecamatanId: {
            type: DataTypes.BIGINT,
            field: 'kecamatan_id',
        },
        desaId: {
            type: DataTypes.BIGINT,
            field: 'desa_id',
        },
        tanggal: {
            type: DataTypes.DATE,
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
        tableName: 'korluh_palawija',
        modelName: 'KorluhPalawija',
        sequelize,
    });

    return KorluhPalawija;
};