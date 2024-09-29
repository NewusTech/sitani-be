const { PspAlsintanPascapanen, Kecamatan, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    chb_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    chb_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    chb_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    chk_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    chk_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    chk_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    power_thresher_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    power_thresher_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    power_thresher_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    corn_sheller_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    corn_sheller_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    corn_sheller_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    ptm_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    ptm_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    ptm_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    ptm_mobile_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    ptm_mobile_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    ptm_mobile_apbd: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cs_mobile_apbn: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cs_mobile_tp: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    cs_mobile_apbd: {
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
                chb_apbn,
                chb_tp,
                chb_apbd,
                chk_apbn,
                chk_tp,
                chk_apbd,
                power_thresher_apbn,
                power_thresher_tp,
                power_thresher_apbd,
                corn_sheller_apbn,
                corn_sheller_tp,
                corn_sheller_apbd,
                ptm_apbn,
                ptm_tp,
                ptm_apbd,
                ptm_mobile_apbn,
                ptm_mobile_tp,
                ptm_mobile_apbd,
                cs_mobile_apbn,
                cs_mobile_tp,
                cs_mobile_apbd,
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

            await PspAlsintanPascapanen.create({
                kecamatanId: kecamatan.id,
                tahun,
                chb_apbn,
                chb_tp,
                chb_apbd,
                chk_apbn,
                chk_tp,
                chk_apbd,
                power_thresher_apbn,
                power_thresher_tp,
                power_thresher_apbd,
                corn_sheller_apbn,
                corn_sheller_tp,
                corn_sheller_apbd,
                ptm_apbn,
                ptm_tp,
                ptm_apbd,
                ptm_mobile_apbn,
                ptm_mobile_tp,
                ptm_mobile_apbd,
                cs_mobile_apbn,
                cs_mobile_tp,
                cs_mobile_apbd,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'PSP alsintan pascapanen created'));
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

            const pspAlsintanPascapanen = await PspAlsintanPascapanen.findAll({
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

            const count = await PspAlsintanPascapanen.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/psp/alsintan-pascapanen/get');

            res.status(200).json(response(200, 'Get PSP alsintan pascapanen successfully', { data: pspAlsintanPascapanen, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}