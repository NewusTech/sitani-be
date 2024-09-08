const { KorluhTanamanHiasList, KorluhTanamanHias, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    luas_panen_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    luas_panen_belum_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    luas_rusak: {
        type: "number",
        optional: true,
        convert: true,
    },
    luas_penanaman_baru: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi_belum_habis: {
        type: "number",
        optional: true,
        convert: true,
    },
    satuan_produksi: {
        type: "string",
        optional: true,
    },
    rerata_harga: {
        type: "number",
        optional: true,
        integer: true,
        convert: true,
    },
    keterangan: {
        type: "string",
        optional: true,
    },
}

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
                tanggal: {
                    type: "date",
                    convert: true,
                },
                nama_tanaman: {
                    type: "string",
                    max: 255,
                    min: 1,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const {
                kecamatan_id,
                desa_id,
                tanggal,
                nama_tanaman,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                satuan_produksi,
                rerata_harga,
                keterangan,
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

            tanggal = dateGenerate(tanggal);

            const korluhTanamanHias = await KorluhTanamanHias.findOrCreate({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    desaId: desa_id,
                },
                defaults: {
                    kecamatanId: kecamatan_id,
                    desaId: desa_id,
                    tanggal,
                }
            });

            const korluhTanamanHiasListExists = await KorluhTanamanHiasList.findOne({
                where: {
                    korluhTanamanHiasId: korluhTanamanHias[0].id,
                    namaTanaman: { [Op.like]: nama_tanaman }
                }
            });

            if (korluhTanamanHiasListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh tanaman hias, please use another name",
                        field: 'nama_tanaman',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KorluhTanamanHiasList.create({
                korluhTanamanHiasId: korluhTanamanHias[0].id,
                namaTanaman: nama_tanaman,
                luasPanenHabis: luas_panen_habis,
                luasPanenBelumHabis: luas_panen_belum_habis,
                luasRusak: luas_rusak,
                luasPenanamanBaru: luas_penanaman_baru,
                produksiHabis: produksi_habis,
                produksiBelumHabis: produksi_belum_habis,
                satuanProduksi: satuan_produksi,
                rerataHarga: rerata_harga,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh tanaman hias created'));
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
            let { kecamatan, equalDate, startDate, endDate, limit, page, desa } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};

            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (!isNaN(parseInt(desa))) {
                where.desaId = parseInt(desa);
            }
            if (equalDate) {
                equalDate = new Date(equalDate);
                equalDate = dateGenerate(equalDate);
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            } else {
                if (startDate) {
                    startDate = new Date(startDate);
                    startDate = dateGenerate(startDate);
                    if (startDate instanceof Date && !isNaN(startDate)) {
                        where.tanggal = { [Op.gte]: startDate };
                    }
                }
                if (endDate) {
                    endDate = new Date(endDate);
                    endDate = dateGenerate(endDate);
                    if (endDate instanceof Date && !isNaN(endDate)) {
                        where.tanggal = { ...where.tanggal, [Op.lte]: endDate };
                    }
                }
            }

            const korluhTanamanHias = await KorluhTanamanHias.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: Desa,
                        as: 'desa',
                    },
                    {
                        model: KorluhTanamanHiasList,
                        as: 'list'
                    }
                ],
                offset,
                limit,
                where,
            });

            const count = await KorluhTanamanHias.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/korluh/tanaman-hias/get');

            res.status(200).json(response(200, 'Get korluh tanaman hias successfully', { data: korluhTanamanHias, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    getOne: async (req, res) => {
        try {
            const { id } = req.params;

            const korluhTanamanHiasList = await KorluhTanamanHiasList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhTanamanHias,
                        as: 'korluhTanamanHias',
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
                    },
                ],
            });

            if (!korluhTanamanHiasList) {
                res.status(404).json(response(404, 'Korluh tanaman hias not found'));
                return;
            }

            res.status(200).json(response(200, 'Get korluh tanaman hias successfully', korluhTanamanHiasList));
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

            const korluhTanamanHiasList = await KorluhTanamanHiasList.findOne({
                where: { id },
            });

            const schema = {
                nama_tanaman: {
                    type: "string",
                    optional: true,
                    max: 255,
                    min: 1,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!korluhTanamanHiasList) {
                res.status(404).json(response(404, 'Korluh tanaman hias not found'));
                return;
            }

            let {
                nama_tanaman,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                satuan_produksi,
                rerata_harga,
                keterangan,
            } = req.body;

            if (nama_tanaman) {
                const namaTanamanExists = await KorluhTanamanHiasList.findOne({
                    where: {
                        korluhTanamanHiasId: korluhTanamanHiasList.korluhTanamanHiasId,
                        namaTanaman: { [Op.like]: nama_tanaman },
                        id: { [Op.not]: korluhTanamanHiasList.id },
                    }
                });

                if (namaTanamanExists) {
                    res.status(400).json(response(400, 'Bad Request', [
                        {
                            type: 'duplicate',
                            message: "Cannot updated korluh tanaman hias, please use another name",
                            field: 'nama_tanaman',
                        },
                    ]));
                    return;
                }
            } else {
                nama_tanaman = korluhTanamanHiasList.namaTanaman;
            }

            await korluhTanamanHiasList.update({
                namaTanaman: nama_tanaman,
                luasPanenHabis: luas_panen_habis,
                luasPanenBelumHabis: luas_panen_belum_habis,
                luasRusak: luas_rusak,
                luasPenanamanBaru: luas_penanaman_baru,
                produksiHabis: produksi_habis,
                produksiBelumHabis: produksi_belum_habis,
                satuanProduksi: satuan_produksi,
                rerataHarga: rerata_harga,
                keterangan,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update korluh tanaman hias successfully'));
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

            const korluhTanamanHiasList = await KorluhTanamanHiasList.findOne({
                where: { id },
            });

            if (!korluhTanamanHiasList) {
                res.status(404).json(response(404, 'Korluh tanaman hias not found'));
                return;
            }

            const korluhTanamanHiasId = korluhTanamanHiasList.korluhTanamanHiasId;

            await korluhTanamanHiasList.destroy();

            const korluhTanamanHiasListExists = await KorluhTanamanHiasList.findOne({
                where: { korluhTanamanHiasId }
            });

            if (!korluhTanamanHiasListExists) {
                await KorluhTanamanHias.destroy({
                    where: { id: korluhTanamanHiasId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete korluh tanaman hias successfully'));
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