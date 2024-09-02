const { PenyuluhKecamatan, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

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
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const { kecamatan_id, keterangan, golongan, pangkat, nama, nip } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);

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

            await PenyuluhKecamatan.create({
                kecamatanId: kecamatan.id,
                keterangan,
                golongan,
                pangkat,
                nama,
                nip,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Penyuluh kecamatan created'));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            await transaction.rollback();

            res.status(500).json(response(500, 'Internal server error'));
        }
    },
}