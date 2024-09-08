const { PenyuluhKabupatenDesabinaan, PenyuluhKabupaten, Kecamatan, sequelize } = require('../models');
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
                    convert: true,
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
                        convert: true,
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

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getAll: async (req, res) => {
        try {
            let { search, limit, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};
            if (search) {
                let nipSearchTemp = isNaN(parseInt(search)) ? 0 : parseInt(search);
                where = {
                    [Op.or]: {
                        keterangan: { [Op.like]: `%${search}%` },
                        golongan: { [Op.like]: `%${search}%` },
                        pangkat: { [Op.like]: `%${search}%` },
                        nama: { [Op.like]: `%${search}%` },
                        nip: nipSearchTemp,
                    }
                };
            }

            const penyuluhKabupaten = await PenyuluhKabupaten.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
                offset,
                limit,
                where,
            });

            const count = await PenyuluhKabupaten.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/penyuluh-kabupaten/get');

            res.status(200).json(response(200, 'Get penyuluh kabupaten successfully', { data: penyuluhKabupaten, pagination }));
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

            const penyuluhKabupaten = await PenyuluhKabupaten.findOne({
                where: { id },
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!penyuluhKabupaten) {
                res.status(404).json(response(404, 'Penyuluh kabupaten not found'));
                return;
            }

            res.status(200).json(response(200, 'Get penyuluh kabupaten successfully', penyuluhKabupaten));
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

            const penyuluhKabupaten = await PenyuluhKabupaten.findOne({
                where: { id },
            });

            const schema = {
                nama: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                nip: {
                    type: "number",
                    max: 99999999999,
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                pangkat: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                golongan: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                keterangan: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                kecamatan_list: {
                    type: "array",
                    optional: true,
                    unique: true,
                    min: 1,
                    items: {
                        type: "number",
                        positive: true,
                        integer: true,
                        convert: true,
                    }
                },
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!penyuluhKabupaten) {
                res.status(404).json(response(404, 'Penyuluh kecamatan not found'));
                return;
            }

            let { kecamatan_list, keterangan, golongan, pangkat, nama, nip } = req.body;

            keterangan = keterangan ?? penyuluhKabupaten.keterangan;
            golongan = golongan ?? penyuluhKabupaten.golongan;
            pangkat = pangkat ?? penyuluhKabupaten.pangkat;
            nama = nama ?? penyuluhKabupaten.nama;
            nip = nip ?? penyuluhKabupaten.nip;

            await penyuluhKabupaten.update({
                keterangan,
                golongan,
                pangkat,
                nama,
                nip,
            });

            if (kecamatan_list?.length) {
                const kecamatanList = await Kecamatan.findAll({ where: { id: kecamatan_list } });

                if (kecamatanList?.length) {
                    await PenyuluhKabupatenDesabinaan.destroy({
                        where: { penyuluhKabupatenId: penyuluhKabupaten.id }
                    });

                    for (const kecamatan of kecamatanList) {
                        await PenyuluhKabupatenDesabinaan.create({
                            penyuluhKabupatenId: penyuluhKabupaten.id,
                            kecamatanId: kecamatan.id,
                        });
                    }
                }
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Update penyuluh kabupaten successfully'));
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

            const penyuluhKabupaten = await PenyuluhKabupaten.findOne({
                where: { id },
            });

            if (!penyuluhKabupaten) {
                res.status(404).json(response(404, 'Penyuluh kabupaten not found'));
                return;
            }

            await PenyuluhKabupatenDesabinaan.destroy({
                where: { penyuluhKabupatenId: penyuluhKabupaten.id }
            });

            await penyuluhKabupaten.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Delete penyuluh kabupaten successfully'));
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