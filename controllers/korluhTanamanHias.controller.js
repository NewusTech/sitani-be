const { ValidasiKorluhTanamanHias, KorluhMasterTanamanHias, KorluhTanamanHiasList, KorluhTanamanHias, Kecamatan, Desa, sequelize } = require('../models');
const { dateGenerate, response, fixedNumber } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
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
                korluh_master_tanaman_hias_id: {
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
                korluh_master_tanaman_hias_id,
                kecamatan_id,
                desa_id,
                tanggal,
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

            const korluhMasterTanamanHias = await KorluhMasterTanamanHias.findByPk(korluh_master_tanaman_hias_id);
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
            if (!korluhMasterTanamanHias) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Korluh master tanaman hias doesn't exists",
                        field: 'korluh_master_tanaman_hias_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOne({
                where: {
                    statusTkKecamatan: 'terima',
                    kecamatanId: kecamatan.id,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), tanggal.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), tanggal.getFullYear()),
                    ]
                }
            });

            if (validasiKorluhTanamanHias) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'error',
                        message: "Cannot created korluh tanaman hias because kecamatan has validated",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

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
                    korluhMasterTanamanHiasId: korluhMasterTanamanHias.id,
                    korluhTanamanHiasId: korluhTanamanHias[0].id,
                }
            });

            if (korluhTanamanHiasListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh tanaman hias, please use another master",
                        field: 'korluh_master_tanaman_hias_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KorluhTanamanHiasList.create({
                korluhMasterTanamanHiasId: korluhMasterTanamanHias.id,
                korluhTanamanHiasId: korluhTanamanHias[0].id,
                ...fixedNumber({
                    luasPanenHabis: luas_panen_habis,
                    luasPanenBelumHabis: luas_panen_belum_habis,
                    luasRusak: luas_rusak,
                    luasPenanamanBaru: luas_penanaman_baru,
                    produksiHabis: produksi_habis,
                    produksiBelumHabis: produksi_belum_habis,
                    rerataHarga: rerata_harga,
                }),
                satuanProduksi: satuan_produksi,
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

            let korluhTanamanHias = await KorluhTanamanHias.findAll({
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
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterTanamanHias,
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

            const count = await KorluhTanamanHias.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/korluh/tanaman-hias/get');

            korluhTanamanHias = korluhTanamanHias.map(item => {
                let temp = {
                    masterIds: [],
                };
                item.list.forEach(i => {
                    const idx = i.master.id;

                    temp[idx] = {
                        master: i.master,
                    };
                    for (let idxVal of [
                        "luasPanenHabis",
                        "luasPanenBelumHabis",
                        "luasRusak",
                        "luasPenanamanBaru",
                        "produksiHabis",
                        "produksiBelumHabis",
                        "satuanProduksi",
                        "rerataHarga",
                        "keterangan",
                    ]) {
                        temp[idx][idxVal] = i[idxVal];
                    }
                    temp[idx]['id'] = i.id;

                    temp.masterIds.push(idx);
                });
                return {
                    kecamatanId: item.kecamatanId,
                    tanggal: item.tanggal,
                    desaId: item.desaId,

                    kecamatan: item?.kecamatan,
                    desa: item?.desa,

                    ...temp,
                };
            });

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
                    {
                        model: KorluhMasterTanamanHias,
                        as: 'master'
                    }
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

            const korluhTanamanHias = await KorluhTanamanHias.findByPk(korluhTanamanHiasList.korluhTanamanHiasId);

            if (!korluhTanamanHias) {
                res.status(404).json(response(404, 'Korluh tanaman hias error'));
                return;
            }

            const tanggal = new Date(korluhTanamanHias.tanggal);

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOne({
                where: {
                    statusTkKecamatan: 'terima',
                    kecamatanId: korluhTanamanHias.kecamatanId,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), tanggal.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), tanggal.getFullYear()),
                    ]
                }
            });

            if (validasiKorluhTanamanHias) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'error',
                        message: "Cannot created korluh tanaman hias because kecamatan has validated",
                        field: 'tanggal',
                    },
                ]));
                return;
            }

            let {
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

            await korluhTanamanHiasList.update({
                ...fixedNumber({
                    luasPanenHabis: luas_panen_habis,
                    luasPanenBelumHabis: luas_panen_belum_habis,
                    luasRusak: luas_rusak,
                    luasPenanamanBaru: luas_penanaman_baru,
                    produksiHabis: produksi_habis,
                    produksiBelumHabis: produksi_belum_habis,
                    rerataHarga: rerata_harga,
                }),
                satuanProduksi: satuan_produksi,
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

            const korluhTanamanHias = await KorluhTanamanHias.findByPk(korluhTanamanHiasId);

            if (!korluhTanamanHias) {
                res.status(404).json(response(404, 'Korluh tanaman hias error'));
                return;
            }

            const tanggal = new Date(korluhTanamanHias.tanggal);

            const validasiKorluhTanamanHias = await ValidasiKorluhTanamanHias.findOne({
                where: {
                    statusTkKecamatan: 'terima',
                    kecamatanId: korluhTanamanHias.kecamatanId,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), tanggal.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), tanggal.getFullYear()),
                    ]
                }
            });

            if (validasiKorluhTanamanHias) {
                res.status(403).json(response(403, 'Korluh tanaman hias deleted failed because kacamatan has validated'));
                return;
            }

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