const { PspAlsintanPrapanen, Kecamatan, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

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
                        message: "Kecamatan doesn't exists",
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

            res.status(201).json(response(201, 'PSP alsintan prapanen created'));
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