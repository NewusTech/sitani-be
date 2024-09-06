'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhTanamanHias extends Model {
        static associate(models) {
            KorluhTanamanHias.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            KorluhTanamanHias.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
        }
    }

    KorluhTanamanHias.init({
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
        tableName: 'korluh_tanaman_hias',
        modelName: 'KorluhTanamanHias',
        sequelize,
    });

    return KorluhTanamanHias;
};