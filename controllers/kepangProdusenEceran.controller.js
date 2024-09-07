const { KepangProdusenEceranList, KepangMasterKomoditas, KepangProdusenEceran, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
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

            const {
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
}