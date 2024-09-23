const {
    TphRealisasiPalawija1List,
    TphRealisasiPalawija2List,
    TphLahanBukanSawahList,
    TphRealisasiPalawija1,
    TphRealisasiPalawija2,
    TphRealisasiPadiList,
    TphLahanBukanSawah,
    TphLahanSawahList,
    TphRealisasiPadi,
    TphLahanSawah,
    sequelize
} = require('../models');
const { response, dateGenerate, getFirstLastDate, fixedNumber } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let lahanBukanSawahSum = 0;
            let lahanSawahSum = 0;
            let temp = {};

            const tphLahanBukanSawah = await TphLahanBukanSawah.findOne({
                where: {
                    tahun: year
                },
                include: [
                    {
                        model: TphLahanBukanSawahList,
                        as: 'list'
                    }
                ]
            })
            const tphLahanSawah = await TphLahanSawah.findOne({
                where: {
                    tahun: year
                },
                include: [
                    {
                        model: TphLahanSawahList,
                        as: 'list'
                    }
                ]
            })

            let tphRealisasiPadi = await TphRealisasiPadi.findAll({
                include: [
                    {
                        model: TphRealisasiPadiList,
                        as: 'list',
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                    ]
                },
            });

            let tphRealisasiPalawija1 = await TphRealisasiPalawija1.findAll({
                include: [
                    {
                        model: TphRealisasiPalawija1List,
                        as: 'list',
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                    ]
                },
            });

            let tphRealisasiPalawija2 = await TphRealisasiPalawija2.findAll({
                include: [
                    {
                        model: TphRealisasiPalawija2List,
                        as: 'list',
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year),
                    ]
                },
            });

            tphLahanBukanSawah?.list?.forEach(item => {
                if (item.jumlahLahanBukanSawah) {
                    lahanBukanSawahSum += item.jumlahLahanBukanSawah;
                }
            })
            tphLahanSawah?.list?.forEach(item => {
                if (item.jumlah) {
                    lahanSawahSum += item.jumlah;
                }
            })

            tphRealisasiPadi.forEach(item => {
                item.list.forEach(i => {
                    for (let idx of [
                        "produktivitasLahanKering",
                        "produktivitasLahanSawah",
                        "produksiLahanKering",
                        "produksiLahanSawah",
                        "panenLahanKering",
                        "panenLahanSawah",
                        "produktivitasTotal",
                        "produksiTotal",
                        "panenTotal",
                    ]) {
                        temp[idx] = temp[idx] || 0;
                        if (i[idx]) {
                            temp[idx] = (fixedNumber({ x: temp[idx] + i[idx] })).x;
                        }
                    }
                })
            })

            tphRealisasiPadi = temp;
            temp = {};

            tphRealisasiPalawija1.forEach(item => {
                item.list.forEach(i => {
                    for (let idx of [
                        "jagungPanen",
                        "jagungProduktivitas",
                        "jagungProduksi",
                        "kedelaiPanen",
                        "kedelaiProduktivitas",
                        "kedelaiProduksi",
                        "kacangTanahPanen",
                        "kacangTanahProduktivitas",
                        "kacangTanahProduksi",
                    ]) {
                        temp[idx] = temp[idx] || 0;
                        if (i[idx]) {
                            temp[idx] = (fixedNumber({ x: temp[idx] + i[idx] })).x;
                        }
                    }
                })
            })

            tphRealisasiPalawija1 = temp;
            temp = {};

            tphRealisasiPalawija2.forEach(item => {
                item.list.forEach(i => {
                    for (let idx of [
                        "kacangHijauPanen",
                        "kacangHijauProduktivitas",
                        "kacangHijauProduksi",
                        "ubiKayuPanen",
                        "ubiKayuProduktivitas",
                        "ubiKayuProduksi",
                        "ubiJalarPanen",
                        "ubiJalarProduktivitas",
                        "ubiJalarProduksi",
                    ]) {
                        temp[idx] = temp[idx] || 0;
                        if (i[idx]) {
                            temp[idx] = (fixedNumber({ x: temp[idx] + i[idx] })).x;
                        }
                    }
                })
            })

            tphRealisasiPalawija2 = temp;
            temp = {};

            res.status(200).json(response(200, 'Get TPH dashboard data successfully', {
                ...fixedNumber({
                    lahanBukanSawahSum,
                    lahanSawahSum,
                }),

                tphRealisasiPalawija1,
                tphRealisasiPalawija2,
                tphRealisasiPadi,

                tahun: year
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