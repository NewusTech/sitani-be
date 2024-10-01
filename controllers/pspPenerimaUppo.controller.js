const { PspPenerimaUppo, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const { customMessages, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages,
});

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
                desa_id: {
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
                nama_poktan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                ketua_poktan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                titik_koordinat: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const { kecamatan_id, titik_koordinat, ketua_poktan, nama_poktan, desa_id, tahun } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

            if (!kecamatan) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Kecamatan tidak dapat ditemukan",
                        field: 'kecamatan_id',
                    },
                ]));
                return;
            }

            if (!desa) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Desa tidak dapat ditemukan",
                        field: 'desa_id',
                    },
                ]));
                return;
            }

            await PspPenerimaUppo.create({
                kecamatanId: kecamatan.id,
                desaId: desa.id,
                titikKoordinat: titik_koordinat,
                ketuaPoktan: ketua_poktan,
                namaPoktan: nama_poktan,
                tahun,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'PSP penerima uppo berhasil ditambahkan'));
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
            let { kecamatan, search, limit, page, year } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};
            if (search) {
                where = {
                    [Op.or]: {
                        namaPoktan: { [Op.like]: `%${search}%` },
                        ketuaPoktan: { [Op.like]: `%${search}%` },
                    }
                };
            }
            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (year) {
                where.tahun = year;
            }

            const pspPenerimaUppo = await PspPenerimaUppo.findAll({
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
                order: [['createdAt', 'DESC']]
            });

            const count = await PspPenerimaUppo.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/psp/penerima-uppo/get');

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar PSP penerima uppo', { data: pspPenerimaUppo, pagination }));
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

            const pspPenerimaUppo = await PspPenerimaUppo.findOne({
                where: { id },
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
            });

            if (!pspPenerimaUppo) {
                res.status(404).json(response(404, 'Psp penerima uppo tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan PSP penerima uppo', pspPenerimaUppo));
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

            const pspPenerimaUppo = await PspPenerimaUppo.findOne({
                where: { id },
            });

            const schema = {
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                desa_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                tahun: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                nama_poktan: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                ketua_poktan: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                titik_koordinat: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
            };

            const validate = v.validate(req.body, schema);

            if (!pspPenerimaUppo) {
                res.status(404).json(response(404, 'Psp penerima uppo tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let { kecamatan_id, titik_koordinat, ketua_poktan, nama_poktan, desa_id, tahun } = req.body;

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? pspPenerimaUppo.kecamatanId;
            } else {
                kecamatan_id = pspPenerimaUppo.kecamatanId;
            }

            if (desa_id) {
                const desa = await Desa.findByPk(desa_id);

                desa_id = desa?.id ?? pspPenerimaUppo.desaId;
            } else {
                desa_id = pspPenerimaUppo.desaId;
            }

            titik_koordinat = titik_koordinat ?? pspPenerimaUppo.titikKoordinat;
            ketua_poktan = ketua_poktan ?? pspPenerimaUppo.ketuaPoktan;
            nama_poktan = nama_poktan ?? pspPenerimaUppo.namaPoktan;
            tahun = tahun ?? pspPenerimaUppo.tahun;

            await pspPenerimaUppo.update({
                kecamatanId: kecamatan_id,
                desaId: desa_id,
                titikKoordinat: titik_koordinat,
                ketuaPoktan: ketua_poktan,
                namaPoktan: nama_poktan,
                tahun,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui PSP penerima uppo'));
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

            const pspPenerimaUppo = await PspPenerimaUppo.findOne({
                where: { id },
            });

            if (!pspPenerimaUppo) {
                res.status(404).json(response(404, 'PSP penerima uppo tidak dapat ditemukan'));
                return;
            }

            await pspPenerimaUppo.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus PSP penerima uppo'));
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