const { PenyuluhKabupatenDesabinaan, PenyuluhKabupaten, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                nama: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                nip: {
                    type: "number",
                    max: 99999999999,
                    positive: true,
                    integer: true,
                },
                pangkat: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                golongan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                keterangan: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                kecamatan_list: {
                    type: "array",
                    unique: true,
                    min: 1,
                    items: {
                        type: "number",
                        positive: true,
                        integer: true,
                    }
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const { kecamatan_list, keterangan, golongan, pangkat, nama, nip } = req.body;

            const penyuluhKabupaten = await PenyuluhKabupaten.create({
                keterangan,
                golongan,
                pangkat,
                nama,
                nip,
            });

            const kecamatanList = await Kecamatan.findAll({ where: { id: kecamatan_list } });

            for (const kecamatan of kecamatanList) {
                await PenyuluhKabupatenDesabinaan.create({
                    penyuluhKabupatenId: penyuluhKabupaten.id,
                    kecamatanId: kecamatan.id,
                });
            }

            await transaction.commit();

            res.status(201).json(response(201, 'Penyuluh kabupaten created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            res.status(500).json(response(500, 'Internal server error'));
        }
    },

    getAll: async (req, res) => {
        try {
            const penyuluhKabupaten = await PenyuluhKabupaten.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            res.status(200).json(response(200, 'Get penyuluh kabupaten successfully', penyuluhKabupaten));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error'));
        }
    },
}