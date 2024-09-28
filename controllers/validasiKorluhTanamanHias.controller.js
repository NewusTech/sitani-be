const { ValidasiKorluhTanamanHias, KorluhMasterTanamanHias, KorluhTanamanHiasList, KorluhTanamanHias, Kecamatan, User, sequelize } = require('../models');
const { dateGenerate, response, fixedNumber } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const getInterval = (triwulan) => {
    const interval = {
        1: { start: 1, end: 3, value: 1 },
        2: { start: 4, end: 6, value: 2 },
        3: { start: 7, end: 9, value: 3 },
        4: { start: 10, end: 12, value: 4 },
    }
    return interval[triwulan];
}

const dataMap = (data, triwulan = undefined, tahun = undefined, kecamatan = undefined, validasi = undefined) => {
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

    if (triwulan !== undefined) {
        return {
            triwulan: triwulan.value,
            tahun: tahun,
            kecamatanId: kecamatan?.id,
            kecamatan: kecamatan?.nama,
            status: validasi?.status || 'belum',
            keterangan: validasi?.keterangan,
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
                    triwulanLalu: 0,
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
                triwulanLalu: before[nt] ? before[nt]['akhir'] || 0 : 0,
                akhir: Number(current[nt]['triwulanLalu']) + Number(current[nt]["luasPenanamanBaru"]) - Number(current[nt]["luasPanenHabis"]) - Number(current[nt]["luasRusak"]),
            }),
        }
    });
    return current;
}

const getSum = async (triwulan, tahun, kecamatan = undefined) => {
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
                sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '>=', triwulan.start),
                sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '<=', triwulan.end),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), tahun),
            ]
        }
    });

    if (data.length > 0) {
        let triwulanAgo = triwulan.value - 1 === 0 ? 4 : triwulan.value - 1;
        const tahunTriwulanAgo = triwulanAgo > triwulan.value ? tahun - 1 : tahun;

        triwulanAgo = getInterval(triwulanAgo);

        before = await getSum(triwulanAgo, tahunTriwulanAgo, kecamatan);
        data = dataMap(data);

        return combineData(data, before);
    }

    return 0;
}

module.exports = {
    validate: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                tahun: {
                    type: "number",
                    integer: true,
                    convert: true,
                    min: 1111,
                    max: 9999,
                },
                triwulan: {
                    type: "number",
                    integer: true,
                    convert: true,
                    min: 1,
                    max: 4,
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
                tahun,
                triwulan,
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

            triwulan = getInterval(triwulan);
            currentDate = dateGenerate(new Date());

            const korluhTanamanHiasCount = await KorluhTanamanHias.count({
                where: {
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '>=', triwulan.start),
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '<=', triwulan.end),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), tahun),
                    ]
                }
            });

            if (
                (triwulan.start >= currentDate.getMonth() + 1 && tahun === currentDate.getFullYear())
                ||
                tahun > currentDate.getFullYear()
                ||
                korluhTanamanHiasCount === 0
            ) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'invalid',
                        message: "Action failed with the following triwulan",
                        field: 'triwulan',
                    },
                ]));
                return;
            }

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOrCreate({
                where: {
                    kecamatanId: kecamatan.id,
                    triwulan: triwulan.value,
                    tahun
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    triwulan: triwulan.value,
                    tahun
                }
            });

            keterangan = keterangan || null;

            await validasiKorluhTanamanHias[0].update({
                keterangan,
                status,
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

    data: async (req, res) => {
        try {
            let { kecamatan, triwulan, tahun } = req.query;

            const currentDate = dateGenerate(new Date());

            kecamatan = isNaN(parseInt(kecamatan)) ? 0 : parseInt(kecamatan);
            tahun = isNaN(parseInt(tahun)) ? 0 : parseInt(tahun);

            if (tahun < 1111 || tahun > 9999) {
                tahun = dateGenerate(new Date()).getFullYear();
            }

            if (!isNaN(parseInt(triwulan))) {
                triwulan = parseInt(triwulan);
                if (triwulan < 1 || triwulan > 4) {
                    triwulan = null;
                }
            }

            if (isNaN(parseInt(triwulan))) {
                const currentMonth = currentDate.getMonth() + 1;
                triwulan = parseInt((currentMonth + ((3 - (currentMonth % 3)) % 3)) / 3);
            }

            let triwulanAgo = triwulan - 1 === 0 ? 4 : triwulan - 1;
            const tahunTriwulanAgo = triwulanAgo > triwulan ? tahun - 1 : tahun;

            triwulanAgo = getInterval(triwulanAgo);
            triwulan = getInterval(triwulan);

            const kec = await Kecamatan.findByPk(kecamatan);

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOne({
                where: {
                    kecamatanId: kecamatan,
                    triwulan: triwulan.value,
                    tahun,
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
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '>=', triwulan.start),
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '<=', triwulan.end),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), tahun),
                    ]
                }
            });

            current = dataMap(current, triwulan, tahun, kec, validasiKorluhTanamanHias);

            before = await getSum(triwulanAgo, tahunTriwulanAgo, kecamatan);

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