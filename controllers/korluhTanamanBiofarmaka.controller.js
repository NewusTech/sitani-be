const {
    KorluhMasterTanamanBiofarmaka,
    KorluhTanamanBiofarmakaList,
    KorluhTanamanBiofarmaka,
    Kecamatan,
    User,
    sequelize
} = require('../models');
const { getInterval } = require('./validasiKorluhTanamanBiofarmaka.controller')
const { dateGenerate, fixedNumber, response } = require('../helpers');
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
                korluh_master_tanaman_biofarmaka_id: {
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
                korluh_master_tanaman_biofarmaka_id,
                kecamatan_id,
                tanggal,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga,
                keterangan,
            } = req.body;

            const korluhMasterTanamanBiofarmaka = await KorluhMasterTanamanBiofarmaka.findByPk(korluh_master_tanaman_biofarmaka_id);
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
            if (!korluhMasterTanamanBiofarmaka) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Korluh master tanaman biofarmaka doesn't exists",
                        field: 'korluh_master_tanaman_biofarmaka_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const korluhTanamanBiofarmaka = await KorluhTanamanBiofarmaka.findOrCreate({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    kecamatanId: kecamatan.id,
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    tanggal,
                }
            });

            const korluhTanamanBiofarmakaListExists = await KorluhTanamanBiofarmakaList.findOne({
                where: {
                    korluhMasterTanamanBiofarmakaId: korluhMasterTanamanBiofarmaka.id,
                    korluhTanamanBiofarmakaId: korluhTanamanBiofarmaka[0].id,
                }
            });

            if (korluhTanamanBiofarmakaListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh tanaman biofarmaka, please use another master",
                        field: 'korluh_master_tanaman_biofarmaka_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KorluhTanamanBiofarmakaList.create({
                korluhMasterTanamanBiofarmakaId: korluhMasterTanamanBiofarmaka.id,
                korluhTanamanBiofarmakaId: korluhTanamanBiofarmaka[0].id,
                keterangan,
                ...fixedNumber({
                    luasPanenHabis: luas_panen_habis,
                    luasPanenBelumHabis: luas_panen_belum_habis,
                    luasRusak: luas_rusak,
                    luasPenanamanBaru: luas_penanaman_baru,
                    produksiHabis: produksi_habis,
                    produksiBelumHabis: produksi_belum_habis,
                    rerataHarga: rerata_harga,
                }),
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh tanaman biofarmaka created'));
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
            let { kecamatan, equalDate, startDate, triwulan, endDate, limit, tahun, page } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            let offset = (page - 1) * limit;

            if (req?.root?.userId) {
                const user = await User.findByPk(req.root.userId, {
                    include: [
                        {
                            model: Kecamatan,
                            as: 'kecamatans'
                        },
                    ]
                });

                if (user?.kecamatans?.length) {
                    kecamatan = user.kecamatans[0].id;
                }
            }

            let where = {};

            if (!isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }
            if (triwulan || tahun) {
                offset = undefined;
                limit = undefined;

                tahun = !isNaN(parseInt(tahun)) ? parseInt(tahun) : new Date().getFullYear();
                triwulan = !isNaN(parseInt(triwulan)) ? parseInt(triwulan) : 0;

                if (triwulan < 1 || triwulan > 4) {
                    const currentMonth = new Date().getMonth() + 1;
                    triwulan = parseInt((currentMonth + ((3 - (currentMonth % 3)) % 3)) / 3);
                }

                triwulan = getInterval(triwulan);

                where = {
                    ...where,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '>=', triwulan.start),
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), '<=', triwulan.end),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('tanggal')), tahun),
                    ]
                }
            } else {
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
            }

            let korluhTanamanBiofarmaka = await KorluhTanamanBiofarmaka.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: KorluhTanamanBiofarmakaList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterTanamanBiofarmaka,
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

            const count = await KorluhTanamanBiofarmaka.count({ where });

            limit = limit || 1;

            const pagination = generatePagination(count, page, limit, '/api/korluh/tanaman-biofarmaka/get');

            korluhTanamanBiofarmaka = korluhTanamanBiofarmaka.map(item => {
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
                    kecamatan: item?.kecamatan,
                    tanggal: item.tanggal,

                    ...temp,
                };
            });

            if (triwulan || tahun) {
                let temp = {
                    bulan: []
                };

                for (let item of korluhTanamanBiofarmaka) {
                    const bln = new Date(item.tanggal).getMonth() + 1;

                    temp[bln] = temp[bln] || [];
                    if (!temp.bulan.includes(bln)) {
                        temp.bulan.push(bln);
                    }

                    temp[bln].push(item);
                }

                korluhTanamanBiofarmaka = temp;
            }

            res.status(200).json(response(200, 'Get korluh tanaman biofarmaka successfully', { data: korluhTanamanBiofarmaka, pagination }));
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

            const korluhTanamanBiofarmakaList = await KorluhTanamanBiofarmakaList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhTanamanBiofarmaka,
                        as: 'korluhTanamanBiofarmaka',
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                            },
                        ],
                    },
                    {
                        model: KorluhMasterTanamanBiofarmaka,
                        as: 'master'
                    }
                ],
            });

            if (!korluhTanamanBiofarmakaList) {
                res.status(404).json(response(404, 'Korluh tanaman biofarmaka not found'));
                return;
            }

            res.status(200).json(response(200, 'Get korluh tanaman biofarmaka successfully', korluhTanamanBiofarmakaList));
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

            const korluhTanamanBiofarmakaList = await KorluhTanamanBiofarmakaList.findOne({
                where: { id },
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!korluhTanamanBiofarmakaList) {
                res.status(404).json(response(404, 'Korluh tanaman biofarmaka not found'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const korluhTanamanBiofarmaka = await KorluhTanamanBiofarmaka.findByPk(korluhTanamanBiofarmakaList.korluhTanamanBiofarmakaId);

            if (!korluhTanamanBiofarmaka) {
                res.status(404).json(response(404, 'Korluh tanaman biofarmaka error'));
                return;
            }

            let {
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga,
                keterangan,
            } = req.body;

            await korluhTanamanBiofarmakaList.update({
                ...fixedNumber({
                    luasPanenHabis: luas_panen_habis,
                    luasPanenBelumHabis: luas_panen_belum_habis,
                    luasRusak: luas_rusak,
                    luasPenanamanBaru: luas_penanaman_baru,
                    produksiHabis: produksi_habis,
                    produksiBelumHabis: produksi_belum_habis,
                    rerataHarga: rerata_harga,
                }),
                keterangan,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update korluh tanaman biofarmaka successfully'));
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

            const korluhTanamanBiofarmakaList = await KorluhTanamanBiofarmakaList.findOne({
                where: { id },
            });

            if (!korluhTanamanBiofarmakaList) {
                res.status(404).json(response(404, 'Korluh tanaman biofarmaka not found'));
                return;
            }

            const korluhTanamanBiofarmakaId = korluhTanamanBiofarmakaList.korluhTanamanBiofarmakaId;

            const korluhTanamanBiofarmaka = await KorluhTanamanBiofarmaka.findByPk(korluhTanamanBiofarmakaId);

            if (!korluhTanamanBiofarmaka) {
                res.status(404).json(response(404, 'Korluh tanaman biofarmaka error'));
                return;
            }

            await korluhTanamanBiofarmakaList.destroy();

            const korluhTanamanBiofarmakaListExists = await KorluhTanamanBiofarmakaList.findOne({
                where: { korluhTanamanBiofarmakaId }
            });

            if (!korluhTanamanBiofarmakaListExists) {
                await KorluhTanamanBiofarmaka.destroy({
                    where: { id: korluhTanamanBiofarmakaId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete korluh tanaman biofarmaka successfully'));
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