const { ValidasiKorluhSayurBuah, KorluhSayurBuahList, KorluhSayurBuah, Kecamatan, sequelize } = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const dataMap = (data, date = undefined, kecamatan = undefined, validasi = undefined) => {
    let sum = {};

    data.forEach(i => {
        i.list.forEach(item => {
            for (let index of [
                "luasPanenHabis",
                "luasPanenBelumHabis",
                "luasRusak",
                "luasPenanamanBaru",
                "produksiHabis",
                "produksiBelumHabis",
                "rerataHarga",
            ]) {
                sum['namaTanaman'] = sum['namaTanaman'] || [];
                if (item[index]) {
                    const nt = item.namaTanaman.toLowerCase();
                    if (!sum['namaTanaman'].includes(nt)) {
                        sum['namaTanaman'].push(nt);
                    }
                    if (!sum[nt]) {
                        sum[nt] = {
                            namaTanaman: nt,
                            keterangan: item.keterangan,
                            hasilProduksi: item.hasilProduksi,
                        };
                    }
                    if (sum[nt][index] === undefined) {
                        sum[nt][index] = 0;
                    }
                    sum[nt][index] = sum[nt][index] ? sum[nt][index] + item[index] : item[index];
                    if (index === 'rerataHarga') {
                        sum[nt]['count'] = sum[nt]['count'] ? sum[nt]['count'] + 1 : 1;
                    }
                }
            }
        });
    });

    if (date !== undefined) {
        return {
            bulan: date.getMonth() + 1,
            tahun: date.getFullYear(),
            kecamatan,
            validasi,
            ...sum,
        }
    }
    return sum;
}

const combineData = (current, before) => {
    if (before === 0) {
        current['namaTanaman']?.forEach(nt => {
            current[nt]['bulanLalu'] = 0;

            current[nt]['akhir'] = current[nt]["luasPenanamanBaru"] - current[nt]["luasPanenHabis"] - current[nt]["luasRusak"];
        });
        return current;
    }
    current['namaTanaman']?.forEach(nt => {
        current[nt]['bulanLalu'] = before[nt] ? before[nt]['akhir'] || 0 : 0;

        current[nt]['akhir'] = current[nt]['bulanLalu'] + current[nt]["luasPenanamanBaru"] - current[nt]["luasPanenHabis"] - current[nt]["luasRusak"];
    });
    return current;
}

const getSum = async (bulan, kecamatan = undefined) => {
    let where = {};

    if (kecamatan !== undefined) {
        where.kecamatanId = kecamatan;
    }

    let data = await KorluhSayurBuah.findAll({
        include: [
            {
                model: KorluhSayurBuahList,
                as: 'list'
            }
        ],
        where: {
            ...where,
            [Op.and]: [
                sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
            ]
        }
    });

    if (data.length > 0) {
        bulan.setMonth(bulan.getMonth() - 1);

        before = await getSum(bulan, kecamatan);
        data = dataMap(data);

        return combineData(data, before);
    }

    return 0;
}

module.exports = {
    kecVal: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                bulan: {
                    type: "date",
                    convert: true,
                },
                status: {
                    type: "enum",
                    values: ["terima", "tolak"]
                },
                keterangan: {
                    type: "string",
                    optional: true,
                }
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kecamatan_id,
                bulan,
                status,
                keterangan,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);

            if (!kecamatan) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Kecamatan doesn't exists",
                        field: 'kecamatan_id',
                    },
                ]));
                return;
            }

            bulan = dateGenerate(bulan);
            currentDate = new Date();

            const korluhSayurBuahCount = await KorluhSayurBuah.count({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOrCreate({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    bulan,
                }
            });

            if (
                (bulan.getMonth() >= currentDate.getMonth() && bulan.getFullYear() === currentDate.getFullYear())
                ||
                bulan.getFullYear() > currentDate.getFullYear()
                ||
                validasiKorluhSayurBuah[0]?.statusTkKabupaten === 'terima'
                ||
                korluhSayurBuahCount === 0
            ) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Action failed with the following bulan",
                        field: 'bulan',
                    },
                ]));
                return;
            }

            keterangan = keterangan || validasiKorluhSayurBuah[0].keterangan;

            await validasiKorluhSayurBuah[0].update({
                statusTkKecamatan: status,
                keterangan,
            });

            // VALIDATOR CREATE

            await transaction.commit();

            res.status(200).json(response(200, 'Status validation updated'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kabVal: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                bulan: {
                    type: "date",
                    convert: true,
                },
                status: {
                    type: "enum",
                    values: ["terima", "tolak"]
                },
                keterangan: {
                    type: "string",
                    optional: true,
                }
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                bulan,
                status,
                keterangan,
            } = req.body;

            bulan = dateGenerate(bulan);
            currentDate = new Date();

            const korluhSayurBuah = await KorluhSayurBuah.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhSayurBuahCount = await ValidasiKorluhSayurBuah.count({
                where: {
                    statusTkKecamatan: 'terima',
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            if (
                (bulan.getMonth() >= currentDate.getMonth() && bulan.getFullYear() === currentDate.getFullYear())
                ||
                bulan.getFullYear() > currentDate.getFullYear()
                ||
                count(korluhSayurBuah) === 0
            ) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Action failed with the following bulan",
                        field: 'bulan',
                    },
                ]));
                return;
            }

            let kecamatanIds = [];
            korluhSayurBuah.forEach(item => {
                if (!kecamatanIds.includes(item.kecamatanId)) {
                    kecamatanIds.push(item.kecamatanId);
                }
            });

            if (validasiKorluhSayurBuahCount < count(kecamatanIds)) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: `Action failed because ${count(kecamatanIds) - validasiKorluhSayurBuahCount} kecamatan had not validated`,
                        field: 'bulan',
                    },
                ]));
                return;
            }

            keterangan = keterangan || '';

            await ValidasiKorluhSayurBuah.update({
                statusTkKabupaten: status,
                keterangan,
            }, {
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                }
            });

            // VALIDATOR CREATE

            await transaction.commit();

            res.status(200).json(response(200, 'Status validation updated'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kecData: async (req, res) => {
        try {
            let { kecamatan, bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);


            const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOne({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            validasi = validasiKorluhSayurBuah?.statusTkKecamatan || 'belum';

            let current = await KorluhSayurBuah.findAll({
                include: [
                    {
                        model: KorluhSayurBuahList,
                        as: 'list'
                    }
                ],
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            current = dataMap(current, bulan, kecamatan, validasi);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan, kecamatan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh sayur dan buah successfully', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    kabData: async (req, res) => {
        try {
            let { bulan } = req.query;

            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);

            bulan = isNaN(new Date(bulan)) ? monthAgo : new Date(bulan);

            const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            validasi = validasiKorluhSayurBuah?.statusTkKabupaten || 'belum';

            let current = await KorluhSayurBuah.findAll({
                include: [
                    {
                        model: KorluhSayurBuahList,
                        as: 'list'
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            current = dataMap(current, bulan, undefined, validasi);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh sayur dan buah successfully', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}