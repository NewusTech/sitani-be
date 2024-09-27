const { PenyuluhKelompokTani, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    nama: {
        type: "string",
        max: 255,
        max: 1,
    },
    ketua: {
        type: "string",
        max: 255,
        max: 1,
    },
    sekretaris: {
        type: "string",
        max: 255,
        max: 1,
    },
    bendahara: {
        type: "string",
        max: 255,
        max: 1,
    },
    alamat: {
        type: "string",
        max: 255,
        max: 1,
    },
    dibent: {
        type: "number",
        integer: true,
        convert: true,
        min: 1111,
        max: 9999,
    },
    l: {
        type: "number",
        integer: true,
        convert: true,
    },
    p: {
        type: "number",
        integer: true,
        convert: true,
    },
    kelas: {
        type: "enum",
        values: ['p', 'l', 'm', 'u']
    },
};

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                id_poktan: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
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
                    integer: true,
                    convert: true,
                    min: 1111,
                    max: 9999,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const {
                id_poktan,
                kecamatan_id,
                desa_id,
                tahun,
                nama,
                ketua,
                sekretaris,
                bendahara,
                alamat,
                dibent,
                l,
                p,
                kelas,
            } = req.body;

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

            await PenyuluhKelompokTani.create({
                kecamatanId: kecamatan_id,
                idPoktan: id_poktan,
                desaId: desa_id,
                sekretaris,
                bendahara,
                alamat,
                dibent,
                kelas,
                ketua,
                tahun,
                nama,
                l,
                p,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Penyuluh kelompok tani created'));
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