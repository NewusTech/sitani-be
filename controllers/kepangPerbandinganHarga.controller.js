const { KepangPerbandinganHargaList, KepangMasterKomoditas, KepangPerbandinganHarga, sequelize } = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

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
                bulan: {
                    type: "date",
                    convert: true,
                },
                harga: {
                    type: "number",
                    optional: true,
                    integer: true,
                    convert: true,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kepang_master_komoditas_id,
                bulan,
                harga,
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

            bulan = dateGenerate(bulan);

            const kepangPerbandinganHarga = await KepangPerbandinganHarga.findOrCreate({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
                defaults: {
                    bulan,
                }
            });

            const kepangPerbandinganHargaListExists = await KepangPerbandinganHargaList.findOne({
                where: {
                    kepangPerbandinganHargaId: kepangPerbandinganHarga[0].id,
                    kepangMasterKomoditasId: kepangMasterKomoditas.id,
                }
            });

            if (kepangPerbandinganHargaListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created kepang perbandingan harga, please use another master",
                        field: 'kepang_master_komoditas_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KepangPerbandinganHargaList.create({
                kepangPerbandinganHargaId: kepangPerbandinganHarga[0].id,
                kepangMasterKomoditasId: kepangMasterKomoditas.id,
                harga,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Kepang perbandingan harga created'));
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

            const kepangPerbandinganHarga = await KepangPerbandinganHarga.findAll({
                where: {
                    bulan: sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year)
                },
                include: [
                    {
                        model: KepangPerbandinganHargaList,
                        as: 'list',
                        include: [
                            {
                                model: KepangMasterKomoditas,
                                as: 'komoditas'
                            }
                        ]
                    }
                ]
            });

            res.status(200).json(response(200, 'Get kepang perbandingan harga successfully', kepangPerbandinganHarga));
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

            const kepangPerbandinganHargaList = await KepangPerbandinganHargaList.findOne({
                where: { id },
                include: [
                    {
                        model: KepangMasterKomoditas,
                        as: 'komoditas'
                    },
                    {
                        model: KepangPerbandinganHarga,
                        as: 'kepangPerbandinganHarga',
                    }
                ]
            });

            if (!kepangPerbandinganHargaList) {
                res.status(404).json(response(404, 'Kepang perbandingan harga not found'));
                return;
            }

            res.status(200).json(response(200, 'Get kepang perbandingan harga successfully', kepangPerbandinganHargaList));
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

            const kepangPerbandinganHargaList = await KepangPerbandinganHargaList.findOne({
                where: { id },
            });

            const schema = {
                harga: {
                    type: "number",
                    optional: true,
                    integer: true,
                    convert: true,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!kepangPerbandinganHargaList) {
                res.status(404).json(response(404, 'Kepang perbandingan harga not found'));
                return;
            }

            let {
                harga,
            } = req.body;

            await kepangPerbandinganHargaList.update({
                harga
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update kepang perbandingan harga successfully'));
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

            const kepangPerbandinganHargaList = await KepangPerbandinganHargaList.findOne({
                where: { id },
            });

            if (!kepangPerbandinganHargaList) {
                res.status(404).json(response(404, 'Kepang perbandingan harga not found'));
                return;
            }

            const kepangPerbandinganHargaId = kepangPerbandinganHargaList.kepangPerbandinganHargaId;

            await kepangPerbandinganHargaList.destroy();

            const kepangPerbandinganHargaExits = await KepangPerbandinganHargaList.findOne({
                where: { kepangPerbandinganHargaId }
            });

            if (!kepangPerbandinganHargaExits) {
                await KepangPerbandinganHarga.destroy({
                    where: { id: kepangPerbandinganHargaId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete kepang perbandingan harga successfully'));
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