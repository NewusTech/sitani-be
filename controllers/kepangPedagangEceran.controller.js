const { KepangPedagangEceranList, KepangMasterKomoditas, KepangPedagangEceran, sequelize } = require('../models');
const { getFirstLastDate, dateGenerate, response } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    minggu_1: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    minggu_2: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    minggu_3: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    minggu_4: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    minggu_5: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
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
                minggu_1,
                minggu_2,
                minggu_3,
                minggu_4,
                minggu_5,
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

            const { first, last } = getFirstLastDate(tanggal);

            const kepangPedagangEceran = await KepangPedagangEceran.findOrCreate({
                where: {
                    tanggal: { [Op.between]: [first, last] },
                },
                defaults: {
                    tanggal,
                }
            });

            const kepangPedagangEceranListExists = await KepangPedagangEceranList.findOne({
                where: {
                    kepangPedagangEceranId: kepangPedagangEceran[0].id,
                    kepangMasterKomoditasId: kepangMasterKomoditas.id,
                }
            });

            if (kepangPedagangEceranListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created kepang pedagang eceran, please use another master",
                        field: 'kepang_master_komoditas_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KepangPedagangEceranList.create({
                kepangPedagangEceranId: kepangPedagangEceran[0].id,
                kepangMasterKomoditasId: kepangMasterKomoditas.id,
                minggu1: minggu_1,
                minggu2: minggu_2,
                minggu3: minggu_3,
                minggu4: minggu_4,
                minggu5: minggu_5,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Kepang pedagang eceran created'));
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