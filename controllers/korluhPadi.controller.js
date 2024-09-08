const { KorluhPadi, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

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
                desa_id: {
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
                desa_id,
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
            const desa = await Desa.findByPk(desa_id);

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
            if (!desa) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Desa doesn't exists",
                        field: 'desa_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const korluhPadiExists = await KorluhPadi.findOne({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    desaId: desa_id,
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

            await KorluhPadi.create({
                kecamatanId: kecamatan.id,
                desaId: desa.id,
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
            let { kecamatan, equalDate, startDate, endDate, limit, page, desa } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};

            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (!isNaN(parseInt(desa))) {
                where.desaId = parseInt(desa);
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
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
                offset,
                limit,
                where,
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
                    {
                        model: Desa,
                        as: 'desa',
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
                tanggal: {
                    type: "date",
                    optional: true,
                    convert: true,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!korluhPadi) {
                res.status(404).json(response(404, 'Korluh padi not found'));
                return;
            }

            let {
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

            if (tanggal) {
                tanggal = dateGenerate(tanggal);
                const tanggalExists = await KorluhPadi.findOne({
                    where: { tanggal: { [Op.eq]: tanggal }, desaId: korluhPadi.desaId }
                });
                if (tanggalExists !== null && tanggalExists?.id !== korluhPadi.id) {
                    res.status(400).json(response(400, 'Bad Request', [
                        {
                            type: 'duplicate',
                            message: "Cannot updated korluh padi, please use another tanggal",
                            field: 'tanggal',
                        },
                    ]));
                    return;
                }
            }

            await korluhPadi.update({
                tanggal: tanggal ?? korluhPadi.tanggal,
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
            });

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