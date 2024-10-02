const { PspAlsintanPrapanen, Kecamatan, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const { customMessages, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages
});

const coreSchema = {
    tr_4_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    tr_4_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    tr_4_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    tr_2_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    tr_2_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    tr_2_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    rt_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    rt_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    rt_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cornplanter_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cornplanter_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cornplanter_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cultivator_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cultivator_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cultivator_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    hand_sprayer_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    hand_sprayer_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    hand_sprayer_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    pompa_air_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    pompa_air_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    pompa_air_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    keterangan: {
        type: "string",
        optional: true,
        max: 255,
    },
};

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
                tahun: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                    min: 1111,
                    max: 9999,
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
                tahun,
                tr_4_apbn,
                tr_4_tp,
                tr_4_apbd,
                tr_2_apbn,
                tr_2_tp,
                tr_2_apbd,
                rt_apbn,
                rt_tp,
                rt_apbd,
                cornplanter_apbn,
                cornplanter_tp,
                cornplanter_apbd,
                cultivator_apbn,
                cultivator_tp,
                cultivator_apbd,
                hand_sprayer_apbn,
                hand_sprayer_tp,
                hand_sprayer_apbd,
                pompa_air_apbn,
                pompa_air_tp,
                pompa_air_apbd,
                keterangan,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);

            if (!kecamatan) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Kecamatan tidak dapat ditemukan",
                        field: 'kecamatan_id',
                    },
                ]));
                return;
            }

            await PspAlsintanPrapanen.create({
                kecamatanId: kecamatan.id,
                tahun,
                tr_4_apbn,
                tr_4_tp,
                tr_4_apbd,
                tr_2_apbn,
                tr_2_tp,
                tr_2_apbd,
                rt_apbn,
                rt_tp,
                rt_apbd,
                cornplanter_apbn,
                cornplanter_tp,
                cornplanter_apbd,
                cultivator_apbn,
                cultivator_tp,
                cultivator_apbd,
                hand_sprayer_apbn,
                hand_sprayer_tp,
                hand_sprayer_apbd,
                pompa_air_apbn,
                pompa_air_tp,
                pompa_air_apbd,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'PSP alsintan prapanen berhasil ditambahkan'));
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
            let { kecamatan, limit, page, year } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            kecamatan = isNaN(parseInt(kecamatan)) ? null : parseInt(kecamatan);
            year = isNaN(parseInt(year)) ? null : parseInt(year);

            let where = {};

            if (kecamatan) {
                where.kecamatanId = kecamatan;
            }
            if (year) {
                where.tahun = year;
            }

            const pspAlsintanPrapanen = await PspAlsintanPrapanen.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
                order: [
                    ['tahun', 'DESC'],
                    ['createdAt', 'DESC']
                ],
                offset,
                limit,
                where,
            });

            const count = await PspAlsintanPrapanen.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/psp/alsintan-prapanen/get');

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar PSP alsintan prapanen', { data: pspAlsintanPrapanen, pagination }));
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

            const pspAlsintanPrapanen = await PspAlsintanPrapanen.findOne({
                where: { id },
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!pspAlsintanPrapanen) {
                res.status(404).json(response(404, 'Psp alsintan prapanen tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan PSP alsintan prapanen', pspAlsintanPrapanen));
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

            const pspAlsintanPrapanen = await PspAlsintanPrapanen.findOne({
                where: { id },
            });

            const schema = {
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                tahun: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                    min: 1111,
                    max: 9999,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!pspAlsintanPrapanen) {
                res.status(404).json(response(404, 'Psp alsintan prapanen tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kecamatan_id,
                tahun,
                tr_4_apbn,
                tr_4_tp,
                tr_4_apbd,
                tr_2_apbn,
                tr_2_tp,
                tr_2_apbd,
                rt_apbn,
                rt_tp,
                rt_apbd,
                cornplanter_apbn,
                cornplanter_tp,
                cornplanter_apbd,
                cultivator_apbn,
                cultivator_tp,
                cultivator_apbd,
                hand_sprayer_apbn,
                hand_sprayer_tp,
                hand_sprayer_apbd,
                pompa_air_apbn,
                pompa_air_tp,
                pompa_air_apbd,
                keterangan,
            } = req.body;

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? pspAlsintanPrapanen.kecamatanId;
            } else {
                kecamatan_id = pspAlsintanPrapanen.kecamatanId;
            }

            tahun = tahun ?? pspAlsintanPrapanen.tahun;

            await pspAlsintanPrapanen.update({
                kecamatanId: kecamatan_id,
                tahun,
                tr_4_apbn,
                tr_4_tp,
                tr_4_apbd,
                tr_2_apbn,
                tr_2_tp,
                tr_2_apbd,
                rt_apbn,
                rt_tp,
                rt_apbd,
                cornplanter_apbn,
                cornplanter_tp,
                cornplanter_apbd,
                cultivator_apbn,
                cultivator_tp,
                cultivator_apbd,
                hand_sprayer_apbn,
                hand_sprayer_tp,
                hand_sprayer_apbd,
                pompa_air_apbn,
                pompa_air_tp,
                pompa_air_apbd,
                keterangan,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui PSP alsintan prapanen'));
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

            const pspAlsintanPrapanen = await PspAlsintanPrapanen.findOne({
                where: { id },
            });

            if (!pspAlsintanPrapanen) {
                res.status(404).json(response(404, 'PSP alsintan prapanen tidak dapat ditemukan'));
                return;
            }

            await pspAlsintanPrapanen.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus PSP alsintan prapanen'));
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