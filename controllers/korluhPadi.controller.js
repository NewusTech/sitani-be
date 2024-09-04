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
    },
    hibrida_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    hibrida_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    hibrida_non_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    hibrida_non_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_non_bantuan_pemerintah_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
    },

    lokal_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    lokal_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    lokal_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    lokal_lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
    },
    lokal_lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    lokal_lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_irigasi_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_irigasi_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_irigasi_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_tadah_hujan_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_tadah_hujan_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_tadah_hujan_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_rawa_pasang_surut_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_rawa_pasang_surut_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_rawa_pasang_surut_lahan_sawah_puso: {
        type: "number",
        optional: true,
    },

    sawah_rawa_lebak_lahan_sawah_panen: {
        type: "number",
        optional: true,
    },
    sawah_rawa_lebak_lahan_sawah_tanam: {
        type: "number",
        optional: true,
    },
    sawah_rawa_lebak_lahan_sawah_puso: {
        type: "number",
        optional: true,
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
                },
                desa_id: {
                    type: "number",
                    positive: true,
                    integer: true,
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

            const {
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
                hibridaBantuanPemerintahLahanSawahPanen: hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibridaBantuanPemerintahLahanSawahTanam: hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibridaBantuanPemerintahLahanSawahPuso: hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibridaNonBantuanPemerintahLahanSawahPanen: hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibridaNonBantuanPemerintahLahanSawahTanam: hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibridaNonBantuanPemerintahLahanSawahPuso: hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggulBantuanPemerintahLahanSawahPanen: unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggulBantuanPemerintahLahanSawahTanam: unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggulBantuanPemerintahLahanSawahPuso: unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggulBantuanPemerintahLahanBukanSawahPanen: unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggulBantuanPemerintahLahanBukanSawahTanam: unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggulBantuanPemerintahLahanBukanSawahPuso: unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggulNonBantuanPemerintahLahanSawahPanen: unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggulNonBantuanPemerintahLahanSawahTanam: unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggulNonBantuanPemerintahLahanSawahPuso: unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggulNonBantuanPemerintahLahanBukanSawahPanen: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggulNonBantuanPemerintahLahanBukanSawahTanam: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggulNonBantuanPemerintahLahanBukanSawahPuso: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokalLahanSawahPanen: lokal_lahan_sawah_panen,
                lokalLahanSawahTanam: lokal_lahan_sawah_tanam,
                lokalLahanSawahPuso: lokal_lahan_sawah_puso,
                lokalLahanBukanSawahPanen: lokal_lahan_bukan_sawah_panen,
                lokalLahanBukanSawahTanam: lokal_lahan_bukan_sawah_tanam,
                lokalLahanBukanSawahPuso: lokal_lahan_bukan_sawah_puso,
                sawahIrigasiLahanSawahPanen: sawah_irigasi_lahan_sawah_panen,
                sawahIrigasiLahanSawahTanam: sawah_irigasi_lahan_sawah_tanam,
                sawahIrigasiLahanSawahPuso: sawah_irigasi_lahan_sawah_puso,
                sawahTadahHujanLahanSawahPanen: sawah_tadah_hujan_lahan_sawah_panen,
                sawahTadahHujanLahanSawahTanam: sawah_tadah_hujan_lahan_sawah_tanam,
                sawahTadahHujanLahanSawahPuso: sawah_tadah_hujan_lahan_sawah_puso,
                sawahRawaPasangSurutLahanSawahPanen: sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawahRawaPasangSurutLahanSawahTanam: sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawahRawaPasangSurutLahanSawahPuso: sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawahRawaLebakLahanSawahPanen: sawah_rawa_lebak_lahan_sawah_panen,
                sawahRawaLebakLahanSawahTanam: sawah_rawa_lebak_lahan_sawah_tanam,
                sawahRawaLebakLahanSawahPuso: sawah_rawa_lebak_lahan_sawah_puso,
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
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            } else {
                if (startDate) {
                    startDate = new Date(startDate);
                    if (startDate instanceof Date && !isNaN(startDate)) {
                        where.tanggal = { [Op.gte]: startDate };
                    }
                }
                if (endDate) {
                    endDate = new Date(endDate);
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
            let { equalDate, desa } = req.query;

            let where = {};

            if (!isNaN(parseInt(desa))) {
                where.desaId = parseInt(desa);
            }
            if (equalDate) {
                equalDate = new Date(equalDate);
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            }

            if (!where?.desaId || !where?.tanggal) {
                res.status(404).json(response(404, 'Korluh padi not found'));
                return;
            }

            const korluhPadi = await KorluhPadi.findOne({
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
                where,
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
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                },
                desa_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                },
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

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? korluhPadi.kecamatanId;
            } else {
                kecamatan_id = korluhPadi.kecamatanId;
            }
            if (desa_id) {
                const desa = await Desa.findByPk(desa_id);

                desa_id = desa?.id ?? korluhPadi.desaId;
            } else {
                desa_id = korluhPadi.desaId;
            }
            if (tanggal) {
                const tanggalExists = await KorluhPadi.findOne({
                    where: { tanggal: { [Op.eq]: tanggal }, desaId: desa_id }
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

            hibrida_bantuan_pemerintah_lahan_sawah_panen = hibrida_bantuan_pemerintah_lahan_sawah_panen ?? korluhPadi.hibridaBantuanPemerintahLahanSawahPanen;
            hibrida_bantuan_pemerintah_lahan_sawah_tanam = hibrida_bantuan_pemerintah_lahan_sawah_tanam ?? korluhPadi.hibridaBantuanPemerintahLahanSawahTanam;
            hibrida_bantuan_pemerintah_lahan_sawah_puso = hibrida_bantuan_pemerintah_lahan_sawah_puso ?? korluhPadi.hibridaBantuanPemerintahLahanSawahPuso;
            hibrida_non_bantuan_pemerintah_lahan_sawah_panen = hibrida_non_bantuan_pemerintah_lahan_sawah_panen ?? korluhPadi.hibridaNonBantuanPemerintahLahanSawahPanen;
            hibrida_non_bantuan_pemerintah_lahan_sawah_tanam = hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ?? korluhPadi.hibridaNonBantuanPemerintahLahanSawahTanam;
            hibrida_non_bantuan_pemerintah_lahan_sawah_puso = hibrida_non_bantuan_pemerintah_lahan_sawah_puso ?? korluhPadi.hibridaNonBantuanPemerintahLahanSawahPuso;
            unggul_bantuan_pemerintah_lahan_sawah_panen = unggul_bantuan_pemerintah_lahan_sawah_panen ?? korluhPadi.unggulBantuanPemerintahLahanSawahPanen;
            unggul_bantuan_pemerintah_lahan_sawah_tanam = unggul_bantuan_pemerintah_lahan_sawah_tanam ?? korluhPadi.unggulBantuanPemerintahLahanSawahTanam;
            unggul_bantuan_pemerintah_lahan_sawah_puso = unggul_bantuan_pemerintah_lahan_sawah_puso ?? korluhPadi.unggulBantuanPemerintahLahanSawahPuso;
            unggul_bantuan_pemerintah_lahan_bukan_sawah_panen = unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ?? korluhPadi.unggulBantuanPemerintahLahanBukanSawahPanen;
            unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam = unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ?? korluhPadi.unggulBantuanPemerintahLahanBukanSawahTanam;
            unggul_bantuan_pemerintah_lahan_bukan_sawah_puso = unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ?? korluhPadi.unggulBantuanPemerintahLahanBukanSawahPuso;
            unggul_non_bantuan_pemerintah_lahan_sawah_panen = unggul_non_bantuan_pemerintah_lahan_sawah_panen ?? korluhPadi.unggulNonBantuanPemerintahLahanSawahPanen;
            unggul_non_bantuan_pemerintah_lahan_sawah_tanam = unggul_non_bantuan_pemerintah_lahan_sawah_tanam ?? korluhPadi.unggulNonBantuanPemerintahLahanSawahTanam;
            unggul_non_bantuan_pemerintah_lahan_sawah_puso = unggul_non_bantuan_pemerintah_lahan_sawah_puso ?? korluhPadi.unggulNonBantuanPemerintahLahanSawahPuso;
            unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen = unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ?? korluhPadi.unggulNonBantuanPemerintahLahanBukanSawahPanen;
            unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam = unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ?? korluhPadi.unggulNonBantuanPemerintahLahanBukanSawahTanam;
            unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso = unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ?? korluhPadi.unggulNonBantuanPemerintahLahanBukanSawahPuso;
            lokal_lahan_sawah_panen = lokal_lahan_sawah_panen ?? korluhPadi.lokalLahanSawahPanen;
            lokal_lahan_sawah_tanam = lokal_lahan_sawah_tanam ?? korluhPadi.lokalLahanSawahTanam;
            lokal_lahan_sawah_puso = lokal_lahan_sawah_puso ?? korluhPadi.lokalLahanSawahPuso;
            lokal_lahan_bukan_sawah_panen = lokal_lahan_bukan_sawah_panen ?? korluhPadi.lokalLahanBukanSawahPanen;
            lokal_lahan_bukan_sawah_tanam = lokal_lahan_bukan_sawah_tanam ?? korluhPadi.lokalLahanBukanSawahTanam;
            lokal_lahan_bukan_sawah_puso = lokal_lahan_bukan_sawah_puso ?? korluhPadi.lokalLahanBukanSawahPuso;
            sawah_irigasi_lahan_sawah_panen = sawah_irigasi_lahan_sawah_panen ?? korluhPadi.sawahIrigasiLahanSawahPanen;
            sawah_irigasi_lahan_sawah_tanam = sawah_irigasi_lahan_sawah_tanam ?? korluhPadi.sawahIrigasiLahanSawahTanam;
            sawah_irigasi_lahan_sawah_puso = sawah_irigasi_lahan_sawah_puso ?? korluhPadi.sawahIrigasiLahanSawahPuso;
            sawah_tadah_hujan_lahan_sawah_panen = sawah_tadah_hujan_lahan_sawah_panen ?? korluhPadi.sawahTadahHujanLahanSawahPanen;
            sawah_tadah_hujan_lahan_sawah_tanam = sawah_tadah_hujan_lahan_sawah_tanam ?? korluhPadi.sawahTadahHujanLahanSawahTanam;
            sawah_tadah_hujan_lahan_sawah_puso = sawah_tadah_hujan_lahan_sawah_puso ?? korluhPadi.sawahTadahHujanLahanSawahPuso;
            sawah_rawa_pasang_surut_lahan_sawah_panen = sawah_rawa_pasang_surut_lahan_sawah_panen ?? korluhPadi.sawahRawaPasangSurutLahanSawahPanen;
            sawah_rawa_pasang_surut_lahan_sawah_tanam = sawah_rawa_pasang_surut_lahan_sawah_tanam ?? korluhPadi.sawahRawaPasangSurutLahanSawahTanam;
            sawah_rawa_pasang_surut_lahan_sawah_puso = sawah_rawa_pasang_surut_lahan_sawah_puso ?? korluhPadi.sawahRawaPasangSurutLahanSawahPuso;
            sawah_rawa_lebak_lahan_sawah_panen = sawah_rawa_lebak_lahan_sawah_panen ?? korluhPadi.sawahRawaLebakLahanSawahPanen;
            sawah_rawa_lebak_lahan_sawah_tanam = sawah_rawa_lebak_lahan_sawah_tanam ?? korluhPadi.sawahRawaLebakLahanSawahTanam;
            sawah_rawa_lebak_lahan_sawah_puso = sawah_rawa_lebak_lahan_sawah_puso ?? korluhPadi.sawahRawaLebakLahanSawahPuso;

            await korluhPadi.update({
                tanggal: tanggal ?? korluhPadi.tanggal,
                kecamatanId: kecamatan_id,
                desaId: desa_id,
                hibridaBantuanPemerintahLahanSawahPanen: hibrida_bantuan_pemerintah_lahan_sawah_panen,
                hibridaBantuanPemerintahLahanSawahTanam: hibrida_bantuan_pemerintah_lahan_sawah_tanam,
                hibridaBantuanPemerintahLahanSawahPuso: hibrida_bantuan_pemerintah_lahan_sawah_puso,
                hibridaNonBantuanPemerintahLahanSawahPanen: hibrida_non_bantuan_pemerintah_lahan_sawah_panen,
                hibridaNonBantuanPemerintahLahanSawahTanam: hibrida_non_bantuan_pemerintah_lahan_sawah_tanam,
                hibridaNonBantuanPemerintahLahanSawahPuso: hibrida_non_bantuan_pemerintah_lahan_sawah_puso,
                unggulBantuanPemerintahLahanSawahPanen: unggul_bantuan_pemerintah_lahan_sawah_panen,
                unggulBantuanPemerintahLahanSawahTanam: unggul_bantuan_pemerintah_lahan_sawah_tanam,
                unggulBantuanPemerintahLahanSawahPuso: unggul_bantuan_pemerintah_lahan_sawah_puso,
                unggulBantuanPemerintahLahanBukanSawahPanen: unggul_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggulBantuanPemerintahLahanBukanSawahTanam: unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggulBantuanPemerintahLahanBukanSawahPuso: unggul_bantuan_pemerintah_lahan_bukan_sawah_puso,
                unggulNonBantuanPemerintahLahanSawahPanen: unggul_non_bantuan_pemerintah_lahan_sawah_panen,
                unggulNonBantuanPemerintahLahanSawahTanam: unggul_non_bantuan_pemerintah_lahan_sawah_tanam,
                unggulNonBantuanPemerintahLahanSawahPuso: unggul_non_bantuan_pemerintah_lahan_sawah_puso,
                unggulNonBantuanPemerintahLahanBukanSawahPanen: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen,
                unggulNonBantuanPemerintahLahanBukanSawahTanam: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam,
                unggulNonBantuanPemerintahLahanBukanSawahPuso: unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso,
                lokalLahanSawahPanen: lokal_lahan_sawah_panen,
                lokalLahanSawahTanam: lokal_lahan_sawah_tanam,
                lokalLahanSawahPuso: lokal_lahan_sawah_puso,
                lokalLahanBukanSawahPanen: lokal_lahan_bukan_sawah_panen,
                lokalLahanBukanSawahTanam: lokal_lahan_bukan_sawah_tanam,
                lokalLahanBukanSawahPuso: lokal_lahan_bukan_sawah_puso,
                sawahIrigasiLahanSawahPanen: sawah_irigasi_lahan_sawah_panen,
                sawahIrigasiLahanSawahTanam: sawah_irigasi_lahan_sawah_tanam,
                sawahIrigasiLahanSawahPuso: sawah_irigasi_lahan_sawah_puso,
                sawahTadahHujanLahanSawahPanen: sawah_tadah_hujan_lahan_sawah_panen,
                sawahTadahHujanLahanSawahTanam: sawah_tadah_hujan_lahan_sawah_tanam,
                sawahTadahHujanLahanSawahPuso: sawah_tadah_hujan_lahan_sawah_puso,
                sawahRawaPasangSurutLahanSawahPanen: sawah_rawa_pasang_surut_lahan_sawah_panen,
                sawahRawaPasangSurutLahanSawahTanam: sawah_rawa_pasang_surut_lahan_sawah_tanam,
                sawahRawaPasangSurutLahanSawahPuso: sawah_rawa_pasang_surut_lahan_sawah_puso,
                sawahRawaLebakLahanSawahPanen: sawah_rawa_lebak_lahan_sawah_panen,
                sawahRawaLebakLahanSawahTanam: sawah_rawa_lebak_lahan_sawah_tanam,
                sawahRawaLebakLahanSawahPuso: sawah_rawa_lebak_lahan_sawah_puso,
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
}