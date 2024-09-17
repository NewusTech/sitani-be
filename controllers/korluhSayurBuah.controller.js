const { ValidasiKorluhSayurBuah, KorluhMasterSayurBuah, KorluhSayurBuahList, KorluhSayurBuah, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    hasil_produksi: {
        type: "string",
        optional: true,
    },
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
                korluh_master_sayur_buah_id: {
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

            let {
                korluh_master_sayur_buah_id,
                kecamatan_id,
                desa_id,
                tanggal,
                hasil_produksi,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga,
                keterangan,
            } = req.body;

            const korluhMasterSayurBuah = await KorluhMasterSayurBuah.findByPk(korluh_master_sayur_buah_id);
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
            if (!korluhMasterSayurBuah) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Korluh master sayur dan buah doesn't exists",
                        field: 'korluh_master_sayur_buah_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOne({
                where: {
                    statusTkKecamatan: 'terima',
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), tanggal.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), tanggal.getFullYear()),
                    ]
                }
            });

            if (validasiKorluhSayurBuah) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'error',
                        message: "Cannot created korluh sayur dan buah because kecamatan has validated",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

            const korluhSayurBuah = await KorluhSayurBuah.findOrCreate({
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

            const korluhSayurBuahListExists = await KorluhSayurBuahList.findOne({
                where: {
                    korluhMasterSayurBuahId: korluhMasterSayurBuah.id,
                    korluhSayurBuahId: korluhSayurBuah[0].id,
                }
            });

            if (korluhSayurBuahListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh sayur dan buah, please use another master",
                        field: 'korluh_master_sayur_buah_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KorluhSayurBuahList.create({
                korluhMasterSayurBuahId: korluhMasterSayurBuah.id,
                korluhSayurBuahId: korluhSayurBuah[0].id,
                hasilProduksi: hasil_produksi,
                luasPanenHabis: luas_panen_habis,
                luasPanenBelumHabis: luas_panen_belum_habis,
                luasRusak: luas_rusak,
                luasPenanamanBaru: luas_penanaman_baru,
                produksiHabis: produksi_habis,
                produksiBelumHabis: produksi_belum_habis,
                rerataHarga: rerata_harga,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh sayur dan buah created'));
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

            const korluhSayurBuah = await KorluhSayurBuah.findAll({
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
                        model: KorluhSayurBuahList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterSayurBuah,
                                as: 'master'
                            }
                        ]
                    }
                ],
                offset,
                limit,
                where,
                order: [['tanggal', 'DESC']]
            });

            const count = await KorluhSayurBuah.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/korluh/sayur-buah/get');

            res.status(200).json(response(200, 'Get korluh sayur dan buah successfully', { data: korluhSayurBuah, pagination }));
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

            const korluhSayurBuahList = await KorluhSayurBuahList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhSayurBuah,
                        as: 'korluhSayurBuah',
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
                    {
                        model: KorluhMasterSayurBuah,
                        as: 'master'
                    }
                ],
            });

            if (!korluhSayurBuahList) {
                res.status(404).json(response(404, 'Korluh sayur dan buah not found'));
                return;
            }

            res.status(200).json(response(200, 'Get korluh sayur dan buah successfully', korluhSayurBuahList));
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

            const korluhSayurBuahList = await KorluhSayurBuahList.findOne({
                where: { id },
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            if (!korluhSayurBuahList) {
                res.status(404).json(response(404, 'Korluh sayur dan buah not found'));
                return;
            }

            const korluhSayurBuah = await KorluhSayurBuah.findByPk(korluhSayurBuahList.korluhSayurBuahId);

            if (!korluhSayurBuah) {
                res.status(404).json(response(404, 'Korluh sayur dan buah error'));
                return;
            }

            const tanggal = new Date(korluhSayurBuah.tanggal);

            const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOne({
                where: {
                    statusTkKecamatan: 'terima',
                    kecamatanId: korluhSayurBuah.kecamatanId,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), tanggal.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), tanggal.getFullYear()),
                    ]
                }
            });

            if (validasiKorluhSayurBuah) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'error',
                        message: "Cannot created korluh sayur dan buah because kecamatan has validated",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

            let {
                hasil_produksi,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga,
                keterangan,
            } = req.body;

            await korluhSayurBuahList.update({
                hasilProduksi: hasil_produksi,
                luasPanenHabis: luas_panen_habis,
                luasPanenBelumHabis: luas_panen_belum_habis,
                luasRusak: luas_rusak,
                luasPenanamanBaru: luas_penanaman_baru,
                produksiHabis: produksi_habis,
                produksiBelumHabis: produksi_belum_habis,
                rerataHarga: rerata_harga,
                keterangan,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update korluh sayur dan buah successfully'));
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

            const korluhSayurBuahList = await KorluhSayurBuahList.findOne({
                where: { id },
            });

            if (!korluhSayurBuahList) {
                res.status(404).json(response(404, 'Korluh sayur dan buah not found'));
                return;
            }

            const korluhSayurBuahId = korluhSayurBuahList.korluhSayurBuahId;

            const korluhSayurBuah = await KorluhSayurBuah.findByPk(korluhSayurBuahId);

            if (!korluhSayurBuah) {
                res.status(404).json(response(404, 'Korluh sayur dan buah error'));
                return;
            }

            const tanggal = new Date(korluhSayurBuah.tanggal);

            const validasiKorluhSayurBuah = await ValidasiKorluhSayurBuah.findOne({
                where: {
                    statusTkKecamatan: 'terima',
                    kecamatanId: korluhSayurBuah.kecamatanId,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), tanggal.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), tanggal.getFullYear()),
                    ]
                }
            });

            if (validasiKorluhSayurBuah) {
                res.status(403).json(response(403, 'Korluh sayur dan buah deleted failed because kacamatan has validated'));
                return;
            }

            await korluhSayurBuahList.destroy();

            const korluhSayurBuahExits = await KorluhSayurBuahList.findOne({
                where: { korluhSayurBuahId }
            });

            if (!korluhSayurBuahExits) {
                await KorluhSayurBuah.destroy({
                    where: { id: korluhSayurBuahId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete korluh sayur dan buah successfully'));
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