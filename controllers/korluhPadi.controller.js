const { ValidasiKorluhPadi, KorluhPadi, Kecamatan, Desa, User, sequelize } = require('../models');
const { dateGenerate, fixedNumber, response } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const getSum = (index) => {
    let sum = null;
    for (let idx of index) {
        if (idx) {
            sum = sum ? sum + idx : idx;
        }
    }
    return sum;
}

const coreSchema = {
    hibrida_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    hibrida_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    hibrida_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    hibrida_non_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    hibrida_non_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    unggul_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    unggul_non_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_non_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_non_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    lokal_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    lokal_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    lokal_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    lokal_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    lokal_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    lokal_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    sawah_irigasi_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_irigasi_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_irigasi_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    sawah_tadah_hujan_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_tadah_hujan_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_tadah_hujan_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    sawah_rawa_pasang_surut_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_rawa_pasang_surut_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_rawa_pasang_surut_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },

    sawah_rawa_lebak_lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_rawa_lebak_lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    sawah_rawa_lebak_lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
}

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                tanggal: {
                    type: "date",
                    convert: true,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kecamatan_id,
                tanggal,
                hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokal_lahan_sawah_panen,
                lokal_lahan_sawah_tanam,
                lokal_lahan_sawah_puso,
                lokal_lahan_bukan_sawah_panen,
                lokal_lahan_bukan_sawah_tanam,
                lokal_lahan_bukan_sawah_puso,
                sawah_irigasi_lahan_sawah_panen,
                sawah_irigasi_lahan_sawah_tanam,
                sawah_irigasi_lahan_sawah_puso,
                sawah_tadah_hujan_lahan_sawah_panen,
                sawah_tadah_hujan_lahan_sawah_tanam,
                sawah_tadah_hujan_lahan_sawah_puso,
                sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawah_rawa_lebak_lahan_sawah_panen,
                sawah_rawa_lebak_lahan_sawah_tanam,
                sawah_rawa_lebak_lahan_sawah_puso,
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

            tanggal = dateGenerate(tanggal);

            const korluhPadiExists = await KorluhPadi.findOne({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    kecamatanId: kecamatan.id,
                }
            });

            if (korluhPadiExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh padi, please use another tanggal",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

            let hibrida_lahan_sawah_panen = getSum([hibrida_bantuan_pemerintah_lahan_sawah_panen, hibrida_non_bantuan_pemerintah_lahan_sawah_panen]);
            let hibrida_lahan_sawah_tanam = getSum([hibrida_bantuan_pemerintah_lahan_sawah_tanam, hibrida_non_bantuan_pemerintah_lahan_sawah_tanam]);
            let hibrida_lahan_sawah_puso = getSum([hibrida_bantuan_pemerintah_lahan_sawah_puso, hibrida_non_bantuan_pemerintah_lahan_sawah_puso]);
            let unggul_lahan_sawah_panen = getSum([unggul_bantuan_pemerintah_lahan_sawah_panen, unggul_non_bantuan_pemerintah_lahan_sawah_panen]);
            let unggul_lahan_sawah_tanam = getSum([unggul_bantuan_pemerintah_lahan_sawah_tanam, unggul_non_bantuan_pemerintah_lahan_sawah_tanam]);
            let unggul_lahan_sawah_puso = getSum([unggul_bantuan_pemerintah_lahan_sawah_puso, unggul_non_bantuan_pemerintah_lahan_sawah_puso]);
            let unggul_lahan_bukan_sawah_panen = getSum([unggul_bantuan_pemerintah_lahan_bukan_sawah_panen, unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen]);
            let unggul_lahan_bukan_sawah_tanam = getSum([unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam, unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam]);
            let unggul_lahan_bukan_sawah_puso = getSum([unggul_bantuan_pemerintah_lahan_bukan_sawah_puso, unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso]);
            let jumlah_padi_lahan_sawah_panen = getSum([hibrida_lahan_sawah_panen, unggul_lahan_sawah_panen, lokal_lahan_sawah_panen]);
            let jumlah_padi_lahan_sawah_tanam = getSum([hibrida_lahan_sawah_tanam, unggul_lahan_sawah_tanam, lokal_lahan_sawah_tanam]);
            let jumlah_padi_lahan_sawah_puso = getSum([hibrida_lahan_sawah_puso, unggul_lahan_sawah_puso, lokal_lahan_sawah_puso]);
            let jumlah_padi_lahan_bukan_sawah_panen = getSum([unggul_lahan_bukan_sawah_panen, lokal_lahan_bukan_sawah_panen]);
            let jumlah_padi_lahan_bukan_sawah_tanam = getSum([unggul_lahan_bukan_sawah_tanam, lokal_lahan_bukan_sawah_tanam]);
            let jumlah_padi_lahan_bukan_sawah_puso = getSum([unggul_lahan_bukan_sawah_puso, lokal_lahan_bukan_sawah_puso]);

            let obj = fixedNumber({
                hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokal_lahan_sawah_panen,
                lokal_lahan_sawah_tanam,
                lokal_lahan_sawah_puso,
                lokal_lahan_bukan_sawah_panen,
                lokal_lahan_bukan_sawah_tanam,
                lokal_lahan_bukan_sawah_puso,
                sawah_irigasi_lahan_sawah_panen,
                sawah_irigasi_lahan_sawah_tanam,
                sawah_irigasi_lahan_sawah_puso,
                sawah_tadah_hujan_lahan_sawah_panen,
                sawah_tadah_hujan_lahan_sawah_tanam,
                sawah_tadah_hujan_lahan_sawah_puso,
                sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawah_rawa_lebak_lahan_sawah_panen,
                sawah_rawa_lebak_lahan_sawah_tanam,
                sawah_rawa_lebak_lahan_sawah_puso,

                hibrida_lahan_sawah_panen,
                hibrida_lahan_sawah_tanam,
                hibrida_lahan_sawah_puso,
                unggul_lahan_sawah_panen,
                unggul_lahan_sawah_tanam,
                unggul_lahan_sawah_puso,
                unggul_lahan_bukan_sawah_panen,
                unggul_lahan_bukan_sawah_tanam,
                unggul_lahan_bukan_sawah_puso,
                jumlah_padi_lahan_sawah_panen,
                jumlah_padi_lahan_sawah_tanam,
                jumlah_padi_lahan_sawah_puso,
                jumlah_padi_lahan_bukan_sawah_panen,
                jumlah_padi_lahan_bukan_sawah_tanam,
                jumlah_padi_lahan_bukan_sawah_puso,
            });

            await KorluhPadi.create({
                kecamatanId: kecamatan.id,
                tanggal,
                ...obj,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh padi created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getAll: async (req, res) => {
        try {
            let { kecamatan, equalDate, startDate, endDate, limit, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        },
                    ]
                });

                if (user?.kecamatans?.length) {
                    kecamatan = user.kecamatans[0].id;
                }
            }

            let where = {};

            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (equalDate) {
                equalDate = new Date(equalDate);
                equalDate = dateGenerate(equalDate);
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            } else {
                if (startDate) {
                    startDate = new Date(startDate);
                    startDate = dateGenerate(startDate);
                    if (startDate instanceof Date && !isNaN(startDate)) {
                        where.tanggal = { [Op.gte]: startDate };
                    }
                }
                if (endDate) {
                    endDate = new Date(endDate);
                    endDate = dateGenerate(endDate);
                    if (endDate instanceof Date && !isNaN(endDate)) {
                        where.tanggal = { ...where.tanggal, [Op.lte]: endDate };
                    }
                }
            }

            const korluhPadi = await KorluhPadi.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
                offset,
                limit,
                where,
                order: [['tanggal', 'DESC']]
            });

            const count = await KorluhPadi.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/korluh/padi/get');

            res.status(200).json(response(200, 'Get korluh padi successfully', { data: korluhPadi, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getOne: async (req, res) => {
        try {
            const { id } = req.params;

            const korluhPadi = await KorluhPadi.findOne({
                where: { id },
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!korluhPadi) {
                res.status(404).json(response(404, 'Korluh padi not found'));
                return;
            }

            res.status(200).json(response(200, 'Get korluh padi successfully', korluhPadi));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    update: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            const korluhPadi = await KorluhPadi.findOne({
                where: { id },
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!korluhPadi) {
                res.status(404).json(response(404, 'Korluh padi not found'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokal_lahan_sawah_panen,
                lokal_lahan_sawah_tanam,
                lokal_lahan_sawah_puso,
                lokal_lahan_bukan_sawah_panen,
                lokal_lahan_bukan_sawah_tanam,
                lokal_lahan_bukan_sawah_puso,
                sawah_irigasi_lahan_sawah_panen,
                sawah_irigasi_lahan_sawah_tanam,
                sawah_irigasi_lahan_sawah_puso,
                sawah_tadah_hujan_lahan_sawah_panen,
                sawah_tadah_hujan_lahan_sawah_tanam,
                sawah_tadah_hujan_lahan_sawah_puso,
                sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawah_rawa_lebak_lahan_sawah_panen,
                sawah_rawa_lebak_lahan_sawah_tanam,
                sawah_rawa_lebak_lahan_sawah_puso,
            } = req.body;

            let hibrida_lahan_sawah_panen = getSum([hibrida_bantuan_pemerintah_lahan_sawah_panen, hibrida_non_bantuan_pemerintah_lahan_sawah_panen]);
            let hibrida_lahan_sawah_tanam = getSum([hibrida_bantuan_pemerintah_lahan_sawah_tanam, hibrida_non_bantuan_pemerintah_lahan_sawah_tanam]);
            let hibrida_lahan_sawah_puso = getSum([hibrida_bantuan_pemerintah_lahan_sawah_puso, hibrida_non_bantuan_pemerintah_lahan_sawah_puso]);
            let unggul_lahan_sawah_panen = getSum([unggul_bantuan_pemerintah_lahan_sawah_panen, unggul_non_bantuan_pemerintah_lahan_sawah_panen]);
            let unggul_lahan_sawah_tanam = getSum([unggul_bantuan_pemerintah_lahan_sawah_tanam, unggul_non_bantuan_pemerintah_lahan_sawah_tanam]);
            let unggul_lahan_sawah_puso = getSum([unggul_bantuan_pemerintah_lahan_sawah_puso, unggul_non_bantuan_pemerintah_lahan_sawah_puso]);
            let unggul_lahan_bukan_sawah_panen = getSum([unggul_bantuan_pemerintah_lahan_bukan_sawah_panen, unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen]);
            let unggul_lahan_bukan_sawah_tanam = getSum([unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam, unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam]);
            let unggul_lahan_bukan_sawah_puso = getSum([unggul_bantuan_pemerintah_lahan_bukan_sawah_puso, unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso]);
            let jumlah_padi_lahan_sawah_panen = getSum([hibrida_lahan_sawah_panen, unggul_lahan_sawah_panen, lokal_lahan_sawah_panen]);
            let jumlah_padi_lahan_sawah_tanam = getSum([hibrida_lahan_sawah_tanam, unggul_lahan_sawah_tanam, lokal_lahan_sawah_tanam]);
            let jumlah_padi_lahan_sawah_puso = getSum([hibrida_lahan_sawah_puso, unggul_lahan_sawah_puso, lokal_lahan_sawah_puso]);
            let jumlah_padi_lahan_bukan_sawah_panen = getSum([unggul_lahan_bukan_sawah_panen, lokal_lahan_bukan_sawah_panen]);
            let jumlah_padi_lahan_bukan_sawah_tanam = getSum([unggul_lahan_bukan_sawah_tanam, lokal_lahan_bukan_sawah_tanam]);
            let jumlah_padi_lahan_bukan_sawah_puso = getSum([unggul_lahan_bukan_sawah_puso, lokal_lahan_bukan_sawah_puso]);

            let obj = fixedNumber({
                hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokal_lahan_sawah_panen,
                lokal_lahan_sawah_tanam,
                lokal_lahan_sawah_puso,
                lokal_lahan_bukan_sawah_panen,
                lokal_lahan_bukan_sawah_tanam,
                lokal_lahan_bukan_sawah_puso,
                sawah_irigasi_lahan_sawah_panen,
                sawah_irigasi_lahan_sawah_tanam,
                sawah_irigasi_lahan_sawah_puso,
                sawah_tadah_hujan_lahan_sawah_panen,
                sawah_tadah_hujan_lahan_sawah_tanam,
                sawah_tadah_hujan_lahan_sawah_puso,
                sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawah_rawa_lebak_lahan_sawah_panen,
                sawah_rawa_lebak_lahan_sawah_tanam,
                sawah_rawa_lebak_lahan_sawah_puso,

                hibrida_lahan_sawah_panen,
                hibrida_lahan_sawah_tanam,
                hibrida_lahan_sawah_puso,
                unggul_lahan_sawah_panen,
                unggul_lahan_sawah_tanam,
                unggul_lahan_sawah_puso,
                unggul_lahan_bukan_sawah_panen,
                unggul_lahan_bukan_sawah_tanam,
                unggul_lahan_bukan_sawah_puso,
                jumlah_padi_lahan_sawah_panen,
                jumlah_padi_lahan_sawah_tanam,
                jumlah_padi_lahan_sawah_puso,
                jumlah_padi_lahan_bukan_sawah_panen,
                jumlah_padi_lahan_bukan_sawah_tanam,
                jumlah_padi_lahan_bukan_sawah_puso,
            });

            await korluhPadi.update(obj);

            await transaction.commit();

            res.status(200).json(response(200, 'Update korluh padi successfully'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    delete: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            const korluhPadi = await KorluhPadi.findOne({
                where: { id },
            });

            if (!korluhPadi) {
                res.status(404).json(response(404, 'Korluh padi not found'));
                return;
            }

            await korluhPadi.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Delete korluh padi successfully'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}