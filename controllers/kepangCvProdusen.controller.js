const { KepangCvProdusenList, KepangMasterKomoditas, KepangCvProdusen, sequelize } = require('../models');
const { customMessages, dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages
});

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
                nilai: {
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
                nilai,
            } = req.body;

            const kepangMasterKomoditas = await KepangMasterKomoditas.findByPk(kepang_master_komoditas_id);

            if (!kepangMasterKomoditas) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Kepang master komoditas tidak dapat ditemukan",
                        field: 'kepang_master_komoditas_id',
                    },
                ]));
                return;
            }

            bulan = dateGenerate(bulan);

            const kepangCvProdusen = await KepangCvProdusen.findOrCreate({
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

            const kepangCvProdusenListExists = await KepangCvProdusenList.findOne({
                where: {
                    kepangCvProdusenId: kepangCvProdusen[0].id,
                    kepangMasterKomoditasId: kepangMasterKomoditas.id,
                }
            });

            if (kepangCvProdusenListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Tidak dapat membuat kepang cv produsen, master komoditas sudah digunakan",
                        field: 'kepang_master_komoditas_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KepangCvProdusenList.create({
                kepangCvProdusenId: kepangCvProdusen[0].id,
                kepangMasterKomoditasId: kepangMasterKomoditas.id,
                nilai,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Berhasil membuat kepang cv produsen'));
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

            const kepangCvProdusen = await KepangCvProdusen.findAll({
                where: {
                    bulan: sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), year)
                },
                include: [
                    {
                        model: KepangCvProdusenList,
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

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar kepang cv produsen', kepangCvProdusen));
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

            const kepangCvProdusenList = await KepangCvProdusenList.findOne({
                where: { id },
                include: [
                    {
                        model: KepangMasterKomoditas,
                        as: 'komoditas'
                    },
                    {
                        model: KepangCvProdusen,
                        as: 'kepangCvProdusen',
                    }
                ]
            });

            if (!kepangCvProdusenList) {
                res.status(404).json(response(404, 'Kepang cv produsen tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan kepang cv produsen', kepangCvProdusenList));
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

            const kepangCvProdusenList = await KepangCvProdusenList.findOne({
                where: { id },
            });

            const schema = {
                nilai: {
                    type: "number",
                    optional: true,
                    integer: true,
                    convert: true,
                },
            };

            const validate = v.validate(req.body, schema);

            if (!kepangCvProdusenList) {
                res.status(404).json(response(404, 'Kepang cv produsen tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                nilai,
            } = req.body;

            await kepangCvProdusenList.update({
                nilai
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui kepang cv produsen'));
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

            const kepangCvProdusenList = await KepangCvProdusenList.findOne({
                where: { id },
            });

            if (!kepangCvProdusenList) {
                res.status(404).json(response(404, 'Kepang cv produsen tidak dapat ditemukan'));
                return;
            }

            const kepangCvProdusenId = kepangCvProdusenList.kepangCvProdusenId;

            await kepangCvProdusenList.destroy();

            const kepangCvProdusenExits = await KepangCvProdusenList.findOne({
                where: { kepangCvProdusenId }
            });

            if (!kepangCvProdusenExits) {
                await KepangCvProdusen.destroy({
                    where: { id: kepangCvProdusenId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus kepang cv produsen'));
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