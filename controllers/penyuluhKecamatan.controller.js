const { PenyuluhKecamatanDesabinaan, PenyuluhKecamatan, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const { customMessages, response } = require('../helpers');
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
                kecamatan_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                nama: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                nip: {
                    type: "string",
                    optional: true,
                    convert: true,
                    max: 20,
                },
                pangkat: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
                golongan: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
                keterangan: {
                    type: "string",
                    optional: true,
                    max: 255,
                },
                desa_list: {
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

            const { kecamatan_id, keterangan, desa_list, golongan, pangkat, nama, nip } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);

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

            const penyuluhKecamatan = await PenyuluhKecamatan.create({
                kecamatanId: kecamatan.id,
                keterangan,
                golongan,
                pangkat,
                nama,
                nip,
            });

            const desaList = await Desa.findAll({ where: { id: desa_list } });

            for (const desa of desaList) {
                await PenyuluhKecamatanDesabinaan.create({
                    penyuluhKecamatanId: penyuluhKecamatan.id,
                    desaId: desa.id,
                });
            }

            await transaction.commit();

            res.status(201).json(response(201, 'Berhasil menambahkan penyuluh kecamatan'));
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
            let { kecamatan, search, limit, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};
            if (search) {
                where = {
                    [Op.or]: {
                        keterangan: { [Op.like]: `%${search}%` },
                        golongan: { [Op.like]: `%${search}%` },
                        pangkat: { [Op.like]: `%${search}%` },
                        nama: { [Op.like]: `%${search}%` },
                        nip: { [Op.like]: `%${search}%` },
                    }
                };
            }
            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }

            const penyuluhKecamatan = await PenyuluhKecamatan.findAll({
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

            const count = await PenyuluhKecamatan.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/penyuluh-kecamatan/get');

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar penyuluh kecamatan', { data: penyuluhKecamatan, pagination }));
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

            const penyuluhKecamatan = await PenyuluhKecamatan.findOne({
                where: { id },
                include: [
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
            });

            if (!penyuluhKecamatan) {
                res.status(404).json(response(404, 'Penyuluh kecamatan tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan penyuluh kecamatan', penyuluhKecamatan));
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

            const penyuluhKecamatan = await PenyuluhKecamatan.findOne({
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
                nama: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                nip: {
                    type: "string",
                    optional: true,
                    convert: true,
                    max: 20,
                    min: 1,
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
                desa_list: {
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

            if (!penyuluhKecamatan) {
                res.status(404).json(response(404, 'Penyuluh kecamatan tidak dapat ditemukan'));
                return;
            }

            let { kecamatan_id, keterangan, desa_list, golongan, pangkat, nama, nip } = req.body;

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? penyuluhKecamatan.kecamatanId;
            } else {
                kecamatan_id = penyuluhKecamatan.kecamatanId;
            }

            keterangan = keterangan ?? penyuluhKecamatan.keterangan;
            golongan = golongan ?? penyuluhKecamatan.golongan;
            pangkat = pangkat ?? penyuluhKecamatan.pangkat;
            nama = nama ?? penyuluhKecamatan.nama;
            nip = nip ?? penyuluhKecamatan.nip;

            await penyuluhKecamatan.update({
                kecamatanId: kecamatan_id,
                keterangan,
                golongan,
                pangkat,
                nama,
                nip,
            });

            if (desa_list?.length) {
                const desaList = await Desa.findAll({ where: { id: desa_list } });

                if (desaList?.length) {
                    await PenyuluhKecamatanDesabinaan.destroy({
                        where: { penyuluhKecamatanId: penyuluhKecamatan.id }
                    });

                    for (const desa of desaList) {
                        await PenyuluhKecamatanDesabinaan.create({
                            penyuluhKecamatanId: penyuluhKecamatan.id,
                            desaId: desa.id,
                        });
                    }
                }
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui penyuluh kecamatan'));
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

            const penyuluhKecamatan = await PenyuluhKecamatan.findOne({
                where: { id },
            });

            if (!penyuluhKecamatan) {
                res.status(404).json(response(404, 'Penyuluh kecamatan tidak dapat ditemukan'));
                return;
            }

            await PenyuluhKecamatanDesabinaan.destroy({
                where: { penyuluhKecamatanId: penyuluhKecamatan.id }
            });

            await penyuluhKecamatan.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus penyuluh kecamatan'));
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