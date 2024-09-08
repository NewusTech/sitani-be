const { KepangCvProduksi, sequelize } = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    gkp_tk_petani: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    gkp_tk_penggilingan: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    jpk: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    cabai_merah_keriting: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    beras_medium: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    beras_premium: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    stok_gkg: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
    stok_beras: {
        type: "number",
        optional: true,
        convert: true,
        integer: true,
    },
}

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                bulan: {
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
                bulan,
                panen,
                jpk,
                cabai_merah_keriting,
                gkp_tk_penggilingan,
                beras_premium,
                gkp_tk_petani,
                beras_medium,
                stok_beras,
                stok_gkg,
            } = req.body;

            bulan = dateGenerate(bulan);

            const kepangCvProduksiExists = await KepangCvProduksi.findOne({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                }
            });

            if (kepangCvProduksiExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created kepang cv produksi, please use another bulan",
                        field: 'bulan',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KepangCvProduksi.create({
                bulan,
                panen,
                jpk,
                cabaiMerahKeriting: cabai_merah_keriting,
                gkpTkPenggilingan: gkp_tk_penggilingan,
                berasPremium: beras_premium,
                gkpTkPetani: gkp_tk_petani,
                berasMedium: beras_medium,
                stokBeras: stok_beras,
                stokGkg: stok_gkg,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Kepang cv produksi created'));
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
            let { year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            const kepangCvProduksi = await KepangCvProduksi.findAll({
                where: {
                    bulan: sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year)
                },
                order: [['bulan', 'ASC']]
            });

            res.status(200).json(response(200, 'Get kepang cv produksi successfully', kepangCvProduksi));
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

            const kepangCvProduksi = await KepangCvProduksi.findOne({
                where: { id },
            });

            if (!kepangCvProduksi) {
                res.status(404).json(response(404, 'Kepang cv produksi not found'));
                return;
            }

            res.status(200).json(response(200, 'Get kepang cv produksi successfully', kepangCvProduksi));
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

            const kepangCvProduksi = await KepangCvProduksi.findOne({
                where: { id },
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!kepangCvProduksi) {
                res.status(404).json(response(404, 'Kepang cv produksi not found'));
                return;
            }

            let {
                panen,
                jpk,
                cabai_merah_keriting,
                gkp_tk_penggilingan,
                beras_premium,
                gkp_tk_petani,
                beras_medium,
                stok_beras,
                stok_gkg,
            } = req.body;

            await kepangCvProduksi.update({
                panen,
                jpk,
                cabaiMerahKeriting: cabai_merah_keriting,
                gkpTkPenggilingan: gkp_tk_penggilingan,
                berasPremium: beras_premium,
                gkpTkPetani: gkp_tk_petani,
                berasMedium: beras_medium,
                stokBeras: stok_beras,
                stokGkg: stok_gkg,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update kepang cv produksi successfully'));
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

            const kepangCvProduksi = await KepangCvProduksi.findOne({
                where: { id },
            });

            if (!kepangCvProduksi) {
                res.status(404).json(response(404, 'Kepang cv produksi not found'));
                return;
            }

            await kepangCvProduksi.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Delete kepang cv produksi successfully'));
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