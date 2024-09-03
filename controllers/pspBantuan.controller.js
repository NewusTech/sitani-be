const { PspBantuan, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
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
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                },
                desa_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                },
                jenis_bantuan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                keterangan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                periode: {
                    type: "date",
                    convert: true,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const { kecamatan_id, jenis_bantuan, keterangan, periode, desa_id } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

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

            if (!desa) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Desa doesn't exists",
                        field: 'desa_id',
                    },
                ]));
                return;
            }

            await PspBantuan.create({
                kecamatanId: kecamatan.id,
                desaId: desa.id,
                jenisBantuan: jenis_bantuan,
                keterangan,
                periode,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'PSP bantuan created'));
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
            let { kecamatan, startDate, endDate, search, limit, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};
            if (search) {
                where = {
                    [Op.or]: {
                        jenisBantuan: { [Op.like]: `%${search}%` },
                        keterangan: { [Op.like]: `%${search}%` },
                    }
                };
            }
            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (startDate) {
                startDate = new Date(startDate);
                if (startDate instanceof Date && !isNaN(startDate)) {
                    where.periode = { [Op.gte]: startDate };
                }
            }
            if (endDate) {
                endDate = new Date(endDate);
                if (endDate instanceof Date && !isNaN(endDate)) {
                    where.periode = { ...where.periode, [Op.lte]: endDate };
                }
            }

            const pspBantuan = await PspBantuan.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
                offset,
                limit,
                where,
            });

            const count = await PspBantuan.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/psp/bantuan/get');

            res.status(200).json(response(200, 'Get PSP bantuan successfully', { data: pspBantuan, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    // getOneById: async (req, res) => {
    //     try {
    //         const { id } = req.params;

    //         const pspBantuan = await PspBantuan.findOne({
    //             where: { id },
    //             include: [
    //                 {
    //                     model: Kecamatan,
    //                     as: 'kecamatan',
    //                 },
    //                 {
    //                     model: Desa,
    //                     as: 'desa',
    //                 },
    //             ],
    //         });

    //         if (!pspBantuan) {
    //             res.status(404).json(response(404, 'Psp penerima uppo not found'));
    //             return;
    //         }

    //         res.status(200).json(response(200, 'Get PSP penerima uppo successfully', pspBantuan));
    //     } catch (err) {
    //         console.log(err);

    //         logger.error(`Error : ${err}`);
    //         logger.error(`Error message: ${err.message}`);

    //         // res.status(500).json(response(500, 'Internal server error'));
    //         res.status(500).json(response(500, err.message));
    //     }
    // },

    // update: async (req, res) => {
    //     const transaction = await sequelize.transaction();

    //     try {
    //         const { id } = req.params;

    //         const pspBantuan = await PspBantuan.findOne({
    //             where: { id },
    //         });

    //         const schema = {
    //             kecamatan_id: {
    //                 type: "number",
    //                 optional: true,
    //                 positive: true,
    //                 integer: true,
    //             },
    //             desa_id: {
    //                 type: "number",
    //                 optional: true,
    //                 positive: true,
    //                 integer: true,
    //             },
    //             nama_poktan: {
    //                 type: "string",
    //                 optional: true,
    //                 max: 255,
    //                 min: 1,
    //             },
    //             ketua_poktan: {
    //                 type: "string",
    //                 optional: true,
    //                 max: 255,
    //                 min: 1,
    //             },
    //             titik_koordinat: {
    //                 type: "string",
    //                 optional: true,
    //                 max: 255,
    //             },
    //         };

    //         const validate = v.validate(req.body, schema);

    //         if (validate.length > 0) {
    //             res.status(400).json(response(400, 'Bad Request', validate));
    //             return;
    //         }

    //         if (!pspBantuan) {
    //             res.status(404).json(response(404, 'Psp penerima uppo not found'));
    //             return;
    //         }

    //         let { kecamatan_id, titik_koordinat, ketua_poktan, nama_poktan, desa_id } = req.body;

    //         if (kecamatan_id) {
    //             const kecamatan = await Kecamatan.findByPk(kecamatan_id);

    //             kecamatan_id = kecamatan?.id ?? pspBantuan.kecamatanId;
    //         } else {
    //             kecamatan_id = pspBantuan.kecamatanId;
    //         }

    //         if (desa_id) {
    //             const desa = await Desa.findByPk(desa_id);

    //             desa_id = desa?.id ?? pspBantuan.desaId;
    //         } else {
    //             desa_id = pspBantuan.desaId;
    //         }

    //         titik_koordinat = titik_koordinat ?? pspBantuan.titikKoordinat;
    //         ketua_poktan = ketua_poktan ?? pspBantuan.ketuaPoktan;
    //         nama_poktan = nama_poktan ?? pspBantuan.namaPoktan;

    //         await pspBantuan.update({
    //             kecamatanId: kecamatan_id,
    //             desaId: desa_id,
    //             titikKoordinat: titik_koordinat,
    //             ketuaPoktan: ketua_poktan,
    //             namaPoktan: nama_poktan,
    //         });

    //         await transaction.commit();

    //         res.status(200).json(response(200, 'Update PSP penerima uppo successfully'));
    //     } catch (err) {
    //         console.log(err);

    //         logger.error(`Error : ${err}`);
    //         logger.error(`Error message: ${err.message}`);

    //         await transaction.rollback();

    //         // res.status(500).json(response(500, 'Internal server error'));
    //         res.status(500).json(response(500, err.message));
    //     }
    // },

    // delete: async (req, res) => {
    //     const transaction = await sequelize.transaction();

    //     try {
    //         const { id } = req.params;

    //         const pspBantuan = await PspBantuan.findOne({
    //             where: { id },
    //         });

    //         if (!pspBantuan) {
    //             res.status(404).json(response(404, 'PSP penerima uppo not found'));
    //             return;
    //         }

    //         await pspBantuan.destroy();

    //         await transaction.commit();

    //         res.status(200).json(response(200, 'Delete PSP penerima uppo successfully'));
    //     } catch (err) {
    //         console.log(err);

    //         logger.error(`Error : ${err}`);
    //         logger.error(`Error message: ${err.message}`);

    //         await transaction.rollback();

    //         // res.status(500).json(response(500, 'Internal server error'));
    //         res.status(500).json(response(500, err.message));
    //     }
    // },
}