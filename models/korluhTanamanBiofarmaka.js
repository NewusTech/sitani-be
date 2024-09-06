'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class KorluhTanamanBiofarmaka extends Model {
        static associate(models) {
            KorluhTanamanBiofarmaka.belongsTo(models.Kecamatan, {
                foreignKey: 'kecamatanId',
                as: 'kecamatan',
            });
            KorluhTanamanBiofarmaka.belongsTo(models.Desa, {
                foreignKey: 'desaId',
                as: 'desa'
            });
            KorluhTanamanBiofarmaka.hasMany(models.KorluhTanamanBiofarmakaList, {
                foreignKey: 'korluhTanamanBiofarmakaId',
                as: 'list'
            });
        }
    }

    KorluhTanamanBiofarmaka.init({
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
        tableName: 'korluh_tanaman_biofarmaka',
        modelName: 'KorluhTanamanBiofarmaka',
        sequelize,
    });

    return KorluhTanamanBiofarmaka;
};