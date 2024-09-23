const { ValidasiKorluhPalawija, KorluhMasterPalawija, KorluhPalawijaList, KorluhPalawija, Kecamatan, sequelize } = require('../models');
const { dateGenerate, fixedNumber, response } = require('../helpers');
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
            let temp = {};
            const idx = item.master.id;

            if (!sum['masterIds'].includes(idx)) {
                sum['masterIds'].push(idx);
            }
            if (!sum[idx]) {
                sum[idx] = {
                    nama: item.master.nama,
                };
            }

            temp = sum[idx];

            for (let index of [
                "lahanSawahPanen",
                "lahanSawahPanenMuda",
                "lahanSawahPanenHijauanPakanTernak",
                "lahanSawahTanam",
                "lahanSawahPuso",
                "lahanBukanSawahPanen",
                "lahanBukanSawahPanenMuda",
                "lahanBukanSawahPanenHijauanPakanTernak",
                "lahanBukanSawahTanam",
                "lahanBukanSawahPuso",
                "produksi",
            ]) {
                temp[index] = temp[index] !== undefined ? temp[index] : null;

                if (item[index]) {
                    temp[index] = temp[index] ? Number(temp[index]) + Number(item[index]) : Number(item[index]);
                }
            }

            temp = fixedNumber(temp);

            sum[idx] = temp;
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
    let temp = {};
    if (before === 0) {
        current['masterIds']?.forEach(id => {
            temp = fixedNumber({
                bulanLaluLahanSawah: 0,
                bulanLaluLahanBukanSawah: 0,
                akhirLahanSawah: current[id]["lahanSawahTanam"] - current[id]["lahanSawahPanen"] - current[id]["lahanSawahPanenMuda"] - current[id]["lahanSawahPanenHijauanPakanTernak"] - current[id]["lahanSawahPuso"],
                akhirLahanBukanSawah: current[id]["lahanBukanSawahTanam"] - current[id]["lahanBukanSawahPanen"] - current[id]["lahanBukanSawahPanenMuda"] - current[id]["lahanBukanSawahPanenHijauanPakanTernak"] - current[id]["lahanBukanSawahPuso"],
            });
            current[id] = {
                ...current[id],
                ...temp,
            };
        });
    } else {
        current['masterIds']?.forEach(id => {
            temp = fixedNumber({
                bulanLaluLahanSawah: before[id] ? before[id]['akhirLahanSawah'] || 0 : 0,
                bulanLaluLahanBukanSawah: before[id] ? before[id]['akhirLahanBukanSawah'] || 0 : 0,
                akhirLahanSawah: current[id]['bulanLaluLahanSawah'] + current[id]["lahanSawahTanam"] - current[id]["lahanSawahPanen"] - current[id]["lahanSawahPanenMuda"] - current[id]["lahanSawahPanenHijauanPakanTernak"] - current[id]["lahanSawahPuso"],
                akhirLahanBukanSawah: current[id]['bulanLaluLahanBukanSawah'] + current[id]["lahanBukanSawahTanam"] - current[id]["lahanBukanSawahPanen"] - current[id]["lahanBukanSawahPanenMuda"] - current[id]["lahanBukanSawahPanenHijauanPakanTernak"] - current[id]["lahanBukanSawahPuso"],
            });
            current[id] = {
                ...current[id],
                ...temp,
            };
        });
    }
    return current;
}

const getSum = async (bulan, kecamatan = undefined) => {
    let where = {};

    if (kecamatan !== undefined) {
        where.kecamatanId = kecamatan;
    }

    let data = await KorluhPalawija.findAll({
        include: [
            {
                model: KorluhPalawijaList,
                as: 'list',
                include: [
                    {
                        model: KorluhMasterPalawija,
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
    dataMap, combineData, getSum,

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

            const korluhPalawijaCount = await KorluhPalawija.count({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhPalawija = await ValidasiKorluhPalawija.findOrCreate({
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
                validasiKorluhPalawija[0]?.statusTkKabupaten === 'terima'
                ||
                korluhPalawijaCount === 0
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

            await validasiKorluhPalawija[0].update({
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

            const korluhPalawija = await KorluhPalawija.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), bulan.getFullYear()),
                    ]
                }
            });

            const validasiKorluhPalawijaCount = await ValidasiKorluhPalawija.count({
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
                korluhPalawija.length === 0
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
            korluhPalawija.forEach(item => {
                if (!kecamatanIds.includes(item.kecamatanId)) {
                    kecamatanIds.push(item.kecamatanId);
                }
            });

            if (validasiKorluhPalawijaCount < kecamatanIds.length) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: `Action failed because ${kecamatanIds.length - validasiKorluhPalawijaCount} kecamatan had not validated`,
                        field: 'bulan',
                    },
                ]));
                return;
            }

            keterangan = keterangan || null;

            await ValidasiKorluhPalawija.update({
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

            const validasiKorluhPalawija = await ValidasiKorluhPalawija.findOne({
                where: {
                    kecamatanId: kecamatan,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            let current = await KorluhPalawija.findAll({
                include: [
                    {
                        model: KorluhPalawijaList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterPalawija,
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

            current = dataMap(current, bulan, kec, validasiKorluhPalawija);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan, kecamatan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh palawija successfully', current));
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

            const validasiKorluhPalawija = await ValidasiKorluhPalawija.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
            });

            let current = await KorluhPalawija.findAll({
                include: [
                    {
                        model: KorluhPalawijaList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterPalawija,
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

            current = dataMap(current, bulan, undefined, validasiKorluhPalawija);

            bulan.setMonth(bulan.getMonth() - 1);

            before = await getSum(bulan);

            current = combineData(current, before);

            res.status(200).json(response(200, 'Get korluh palawija successfully', current));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}