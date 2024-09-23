const { ValidasiKorluhTanamanHias, KorluhMasterTanamanHias, KorluhTanamanHiasList, KorluhTanamanHias, Kecamatan, sequelize } = require('../models');
const { dateGenerate, response, fixedNumber } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const dataMap = (data, date = undefined, kecamatan = undefined, validasi = undefined) => {
    let sum = {
        masterIds: []
    };

    data.forEach(i => {
        i.list.forEach(item => {
            let temp = {}
            const masterId = item.master.id;

            if (!sum['masterIds'].includes(masterId)) {
                sum['masterIds'].push(masterId);
            }
            if (!sum[masterId]) {
                sum[masterId] = {
                    master: item.master,
                    keterangan: item.keterangan,
                    satuanProduksi: item.satuanProduksi,
                };
            }

            temp = sum[masterId];

            for (let index of [
                "luasPanenHabis",
                "luasPanenBelumHabis",
                "luasRusak",
                "luasPenanamanBaru",
                "produksiHabis",
                "produksiBelumHabis",
                "rerataHarga",
            ]) {
                temp[index] = temp[index] !== undefined ? temp[index] : null;

                if (item[index]) {
                    temp[index] = temp[index] ? Number(temp[index]) + Number(item[index]) : item[index];

                    if (index === 'rerataHarga') {
                        temp['count'] = temp['count'] ? temp['count'] + 1 : 1;
                    }
                }
            }

            sum[masterId] = fixedNumber(temp);
        });
    });

    if (date !== undefined) {
        return {
            bulan: date.getMonth() + 1,
            tahun: date.getFullYear(),
            kecamatanId: kecamatan?.id,
            kecamatan: kecamatan?.nama,
            validasiKecamatan: validasi?.statusTkKecamatan || 'belum',
            validasiKabupaten: validasi?.statusTkKabupaten || 'belum',
            keteranganKecamatan: validasi?.keteranganKecamatan,
            keteranganKabupaten: validasi?.keteranganKabupaten,
            ...sum,
        }
    }
    return sum;
}

const combineData = (current, before) => {
    if (before === 0) {
        current['masterIds']?.forEach(nt => {
            current[nt] = {
                ...current[nt],
                ...fixedNumber({
                    bulanLalu: 0,
                    akhir: Number(current[nt]["luasPenanamanBaru"]) - Number(current[nt]["luasPanenHabis"]) - Number(current[nt]["luasRusak"]),
                }),
            }
        });
        return current;
    }
    current['masterIds']?.forEach(nt => {
        current[nt] = {
            ...current[nt],
            ...fixedNumber({
                bulanLalu: before[nt] ? before[nt]['akhir'] || 0 : 0,
                akhir: Number(current[nt]['bulanLalu']) + Number(current[nt]["luasPenanamanBaru"]) - Number(current[nt]["luasPanenHabis"]) - Number(current[nt]["luasRusak"]),
            }),
        }
    });
    return current;
}

const getSum = async (bulan, kecamatan = undefined) => {
    let where = {};

    if (kecamatan !== undefined) {
        where.kecamatanId = kecamatan;
    }

    let data = await KorluhTanamanHias.findAll({
        include: [
            {
                model: KorluhTanamanHiasList,
                as: 'list',
                include: [
                    {
                        model: KorluhMasterTanamanHias,
                        as: 'master'
                    }
                ]
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

            const korluhTanamanHiasCount = await KorluhTanamanHias.count({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOrCreate({
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
                validasiKorluhTanamanHias[0]?.statusTkKabupaten === 'terima'
                ||
                korluhTanamanHiasCount === 0
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

            keterangan = keterangan || null;

            await validasiKorluhTanamanHias[0].update({
                statusTkKecamatan: status,
                keteranganKecamatan: keterangan,
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

            const korluhTanamanHias = await KorluhTanamanHias.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhTanamanHiasCount = await ValidasiKorluhTanamanHias.count({
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
                korluhTanamanHias.length === 0
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
            korluhTanamanHias.forEach(item => {
                if (!kecamatanIds.includes(item.kecamatanId)) {
                    kecamatanIds.push(item.kecamatanId);
                }
            });

            if (validasiKorluhTanamanHiasCount < count(kecamatanIds)) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: `Action failed because ${count(kecamatanIds) - validasiKorluhTanamanHiasCount} kecamatan had not validated`,
                        field: 'bulan',
                    },
                ]));
                return;
            }

            keterangan = keterangan || null;

            await ValidasiKorluhTanamanHias.update({
                statusTkKabupaten: status,
                keteranganKabupaten: keterangan,
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

            const kec = await Kecamatan.findByPk(kecamatan);

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOne({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            let current = await KorluhTanamanHias.findAll({
                include: [
                    {
                        model: KorluhTanamanHiasList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterTanamanHias,
                                as: 'master'
                            }
                        ]
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

            current = dataMap(current, bulan, kec, validasiKorluhTanamanHias);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan, kecamatan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh tanaman hias successfully', current));
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

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            let current = await KorluhTanamanHias.findAll({
                include: [
                    {
                        model: KorluhTanamanHiasList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterTanamanHias,
                                as: 'master'
                            }
                        ]
                    }
                ],
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            current = dataMap(current, bulan, undefined, validasiKorluhTanamanHias);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh tanaman hias successfully', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}