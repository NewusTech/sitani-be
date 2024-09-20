const {
    KepangPedagangEceranList,
    KepangProdusenEceranList,
    KepangMasterKomoditas,
    KepangCvProdusenList,
    KepangPedagangEceran,
    KepangProdusenEceran,
    KepangCvProduksi,
    KepangCvProdusen,
    sequelize
} = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { year, month, limit } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);
            month = isNaN(parseInt(month)) ? null : parseInt(month);
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);

            let where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year),
                ]
            }
            let secWhere = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                ]
            }

            if (month) {
                where = {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), year),
                    ]
                }
                secWhere = {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                    ]
                }
            }

            const min = await KepangProdusenEceranList.min('harga', {
                include: [
                    {
                        model: KepangProdusenEceran,
                        as: 'kepangProdusenEceran',
                        where,
                    }
                ]
            });
            const max = await KepangProdusenEceranList.max('harga', {
                include: [
                    {
                        model: KepangProdusenEceran,
                        as: 'kepangProdusenEceran',
                        where,
                    }
                ]
            });

            const komoditas = await KepangMasterKomoditas.findAll();

            let kepangProdusenEceran = [], kepangPedagangEceran = [], kepangCvProdusen = [];
            for (let kom of komoditas) {
                let temp = null;

                if (kepangProdusenEceran.length < limit && limit > 0) {
                    temp = await KepangProdusenEceranList.findAll({
                        include: [
                            {
                                model: KepangProdusenEceran,
                                as: 'kepangProdusenEceran',
                                where,
                            }
                        ],
                        where: {
                            kepangMasterKomoditasId: kom.id
                        }
                    });

                    let harga = count = 0;
                    let satuan = '';
                    temp.forEach(i => {
                        if (i.harga) {
                            harga += i.harga;
                            count++;
                        }
                        if (i.satuan) {
                            satuan = i.satuan;
                        }
                    });

                    kepangProdusenEceran.push({
                        komoditas: kom.nama,
                        harga: count ? harga / count : 0,
                        satuan,
                    });
                }

                if (kepangPedagangEceran.length < limit && limit > 0) {
                    temp = await KepangPedagangEceranList.findAll({
                        include: [
                            {
                                model: KepangPedagangEceran,
                                as: 'kepangPedagangEceran',
                                where,
                            }
                        ],
                        where: {
                            kepangMasterKomoditasId: kom.id
                        }
                    });

                    harga = count = 0;
                    temp.forEach(i => {
                        let countTemp = sumTemp = 0;
                        for (let idx of ['minggu1', 'minggu2', 'minggu3', 'minggu4', 'minggu5']) {
                            if (i[idx]) {
                                sumTemp += i[idx];
                                countTemp++;
                            }
                        }
                        if (sumTemp && countTemp) {
                            harga += sumTemp / countTemp;
                            count++;
                        }
                    });

                    kepangPedagangEceran.push({
                        komoditas: kom.nama,
                        harga: count ? harga / count : 0,
                    })
                }

                if (kepangCvProdusen.length < limit && limit > 0) {
                    const sumData = await KepangCvProdusenList.sum('nilai', {
                        include: [
                            {
                                model: KepangCvProdusen,
                                as: 'kepangCvProdusen',
                                where: secWhere,
                            }
                        ],
                        where: {
                            kepangMasterKomoditasId: kom.id
                        }
                    });
                    const countData = await KepangCvProdusenList.count({
                        include: [
                            {
                                model: KepangCvProdusen,
                                as: 'kepangCvProdusen',
                                where: secWhere,
                            }
                        ],
                        where: {
                            kepangMasterKomoditasId: kom.id
                        }
                    });
                    const maxData = await KepangCvProdusenList.max('nilai', {
                        include: [
                            {
                                model: KepangCvProdusen,
                                as: 'kepangCvProdusen',
                                where: secWhere,
                            }
                        ],
                        where: {
                            kepangMasterKomoditasId: kom.id
                        }
                    });
                    const minData = await KepangCvProdusenList.min('nilai', {
                        include: [
                            {
                                model: KepangCvProdusen,
                                as: 'kepangCvProdusen',
                                where: secWhere,
                            }
                        ],
                        where: {
                            kepangMasterKomoditasId: kom.id
                        }
                    });

                    kepangCvProdusen.push({
                        komoditas: kom.nama,
                        mean: countData ? sumData / countData : 0,
                        max: maxData,
                        min: minData,
                    })
                }
            }

            const kepangCvProduksi = await KepangCvProduksi.findAll({
                where: secWhere,
                order: [['bulan', 'ASC']]
            });

            res.status(200).json(response(200, 'Get katahanan pangan dashboard data successfully', {
                kepangProdusenEceran,
                kepangPedagangEceran,
                kepangCvProduksi,
                kepangCvProdusen,
                hargaTertinggi: max,
                hargaTerendah: min,
            }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}