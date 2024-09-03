const { generatePagination } = require('../pagination/pagination');
const { PspPupuk, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                jenis_pupuk: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                kandungan_pupuk: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                keterangan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                harga_pupuk: {
                    type: "number",
                    max: 99999999999,
                    integer: true,
                    min: 0,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const { jenis_pupuk, kandungan_pupuk, keterangan, harga_pupuk } = req.body;

            await PspPupuk.create({
                kandunganPupuk: kandungan_pupuk,
                jenisPupuk: jenis_pupuk,
                hargaPupuk: harga_pupuk,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'PSP pupuk created'));
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
            let { startDate, endDate, search, limit, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};
            if (search) {
                let hargaSearchTemp = isNaN(parseInt(search)) ? 0 : parseInt(search);
                where = {
                    [Op.or]: {
                        kandunganPupuk: { [Op.like]: `%${search}%` },
                        jenisPupuk: { [Op.like]: `%${search}%` },
                        keterangan: { [Op.like]: `%${search}%` },
                        hargaPupuk: hargaSearchTemp,
                    }
                };
            }
            if (startDate) {
                startDate = new Date(startDate);
                if (startDate instanceof Date && !isNaN(startDate)) {
                    where.createdAt = { [Op.gte]: startDate };
                }
            }
            if (endDate) {
                endDate = new Date(endDate);
                if (endDate instanceof Date && !isNaN(endDate)) {
                    where.createdAt = { ...where.createdAt, [Op.lte]: endDate };
                }
            }

            const pspPupuk = await PspPupuk.findAll({
                offset,
                limit,
                where,
            });

            const count = await PspPupuk.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/psp/pupuk/get');

            res.status(200).json(response(200, 'Get PSP pupuk successfully', { data: pspPupuk, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getOneById: async (req, res) => {
        try {
            const { id } = req.params;

            const pspPupuk = await PspPupuk.findOne({
                where: { id },
            });

            if (!pspPupuk) {
                res.status(404).json(response(404, 'Psp pupuk not found'));
                return;
            }

            res.status(200).json(response(200, 'Get PSP pupuk successfully', pspPupuk));
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

            const pspPupuk = await PspPupuk.findOne({
                where: { id },
            });

            const schema = {
                jenis_pupuk: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                kandungan_pupuk: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                keterangan: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                harga_pupuk: {
                    type: "number",
                    max: 99999999999,
                    optional: true,
                    integer: true,
                    min: 0,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!pspPupuk) {
                res.status(404).json(response(404, 'Psp pupuk not found'));
                return;
            }

            let { jenis_pupuk, kandungan_pupuk, keterangan, harga_pupuk } = req.body;

            kandungan_pupuk = kandungan_pupuk ?? pspPupuk.kandunganPupuk;
            harga_pupuk = harga_pupuk ?? pspPupuk.hargaPupuk;
            jenis_pupuk = jenis_pupuk ?? pspPupuk.jenisPupuk;
            keterangan = keterangan ?? pspPupuk.keterangan;

            await pspPupuk.update({
                kandunganPupuk: kandungan_pupuk,
                hargaPupuk: harga_pupuk,
                jenisPupuk: jenis_pupuk,
                keterangan,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update PSP pupuk successfully'));
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

            const pspPupuk = await PspPupuk.findOne({
                where: { id },
            });

            if (!pspPupuk) {
                res.status(404).json(response(404, 'PSP pupuk not found'));
                return;
            }

            await pspPupuk.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Delete PSP pupuk successfully'));
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