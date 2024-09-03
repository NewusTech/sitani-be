const { PenyuluhKecamatanDesabinaan, PenyuluhKecamatan, PspPenerimaUppo, Kecamatan, Desa, sequelize } = require('../models');
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

            const { kecamatan_id, titik_koordinat, ketua_poktan, nama_poktan, desa_id } = req.body;

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

            await PspPenerimaUppo.create({
                kecamatanId: kecamatan.id,
                desaId: desa.id,
                titikKoordinat: titik_koordinat,
                ketuaPoktan: ketua_poktan,
                namaPoktan: nama_poktan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'PSP penerima uppo created'));
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