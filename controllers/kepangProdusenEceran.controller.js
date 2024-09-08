const { KepangProdusenEceranList, KepangMasterKomoditas, KepangProdusenEceran, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    satuan: {
        type: "string",
        optional: true,
        max: 255,
    },
    harga: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    keterangan: {
        type: "string",
        optional: true,
        max: 255,
    }
}

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                kepang_master_komoditas_id: {
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
                kepang_master_komoditas_id,
                tanggal,
                satuan,
                harga,
                keterangan,
            } = req.body;

            const kepangMasterKomoditas = await KepangMasterKomoditas.findByPk(kepang_master_komoditas_id);

            if (!kepangMasterKomoditas) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Kepang master komoditas doesn't exists",
                        field: 'kepang_master_komoditas_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const kepangProdusenEceran = await KepangProdusenEceran.findOrCreate({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                },
                defaults: {
                    tanggal,
                }
            });

            const kepangProdusenEceranListExists = await KepangProdusenEceranList.findOne({
                where: {
                    kepangProdusenEceranId: kepangProdusenEceran[0].id,
                    kepangMasterKomoditasId: kepangMasterKomoditas.id,
                }
            });

            if (kepangProdusenEceranListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created kepang produsen dan eceran, please use another master",
                        field: 'kepang_master_komoditas_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KepangProdusenEceranList.create({
                kepangProdusenEceranId: kepangProdusenEceran[0].id,
                kepangMasterKomoditasId: kepangMasterKomoditas.id,
                keterangan,
                satuan,
                harga,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Kepang produsen dan eceran created'));
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
            let { equalDate, startDate, endDate, limit, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};

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

            const kepangProdusenEceran = await KepangProdusenEceran.findAll({
                include: [
                    {
                        model: KepangProdusenEceranList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas'
                            }
                        ]
                    }
                ],
                offset,
                limit,
                where,
            });

            const count = await KepangProdusenEceran.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/kepang/produsen-eceran/get');

            res.status(200).json(response(200, 'Get kepang produsen eceran successfully', { data: kepangProdusenEceran, pagination }));
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

            const kepangProdusenEceranList = await KepangProdusenEceranList.findOne({
                where: { id },
                include: [
                    {
                        model: KepangProdusenEceran,
                        as: 'kepangProdusenEceran',
                    },
                    {
                        model: KepangMasterKomoditas,
                        as: 'komoditas',
                    },
                ],
            });

            if (!kepangProdusenEceranList) {
                res.status(404).json(response(404, 'Kepang produsen eceran not found'));
                return;
            }

            res.status(200).json(response(200, 'Get kepang produsen eceran successfully', kepangProdusenEceranList));
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

            const kepangProdusenEceranList = await KepangProdusenEceranList.findOne({
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

            if (!kepangProdusenEceranList) {
                res.status(404).json(response(404, 'Kepang produsen eceran not found'));
                return;
            }

            let {
                keterangan,
                satuan,
                harga,
            } = req.body;

            await kepangProdusenEceranList.update({
                keterangan,
                satuan,
                harga,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update kepang produsen eceran successfully'));
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

            const kepangProdusenEceranList = await KepangProdusenEceranList.findOne({
                where: { id },
            });

            if (!kepangProdusenEceranList) {
                res.status(404).json(response(404, 'Kepang produsen eceran not found'));
                return;
            }

            const kepangProdusenEceranId = kepangProdusenEceranList.kepangProdusenEceranId;

            await kepangProdusenEceranList.destroy();

            const kepangProdusenEceranExits = await KepangProdusenEceranList.findOne({
                where: { kepangProdusenEceranId }
            });

            if (!kepangProdusenEceranExits) {
                await KepangProdusenEceran.destroy({
                    where: { id: kepangProdusenEceranId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete kepang produsen eceran successfully'));
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