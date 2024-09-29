const { KorluhMasterPalawija, KorluhPalawijaList, KorluhPalawija, Kecamatan, User, sequelize } = require('../models');
const { dateGenerate, response, fixedNumber } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const parentSync = async (id, obj, bef) => {
    obj.korluhMasterPalawijaId = id;
    const parent = await KorluhPalawijaList.findOrCreate({
        where: {
            korluhMasterPalawijaId: obj.korluhMasterPalawijaId,
            korluhPalawijaId: obj.korluhPalawijaId,
        },
        defaults: obj
    });

    if (!parent[1]) {
        let temp = {};
        for (let idx of [
            "lahanSawahPanen",
            "lahanSawahPanenMuda",
            "lahanSawahPanenHijauanPakanTernak",
            "lahanSawahTanam",
            "lahanSawahPuso",
            "lahanBukanSawahPanen",
            "lahanBukanSawahPanenMuda",
            "lahanBukanSawahPanenHijauanPakanTernak",
            "lahanBukanSawahTanam",
            "lahanBukanSawahPuso",
            "produksi",
        ]) {
            temp[idx] = parent[0][idx];
            if (obj[idx]) {
                temp[idx] = temp[idx] ? Number(temp[idx]) + Number(obj[idx]) : obj[idx];
            }
            if (bef) {
                if (bef[idx]) {
                    temp[idx] = temp[idx] ? Number(temp[idx]) - Number(bef[idx]) : bef[idx];
                }
            }
        }

        temp = fixedNumber(temp);

        await parent[0].update(temp);
    }
}

const parentSynchronization = async (obj, bef = undefined, deleted = false) => {
    const korluhPalawijaId = obj.korluhPalawijaId, korluhMasterPalawijaId = obj.korluhMasterPalawijaId;
    if ([1, 2, 3, 4].includes(korluhMasterPalawijaId)) {
        await parentSync(17, obj, bef);
        if (deleted) {
            const cek = await KorluhPalawijaList.count({
                where: {
                    korluhPalawijaId,
                    korluhMasterPalawijaId: {
                        [Op.in]: [1, 2, 3, 4]
                    }
                }
            });
            if (!cek) {
                await KorluhPalawijaList.destroy({
                    where: {
                        korluhPalawijaId,
                        korluhMasterPalawijaId: 17,
                    }
                });
            }
        }
    }
    if ([1, 2].includes(korluhMasterPalawijaId)) {
        await parentSync(18, obj, bef);
        if (deleted) {
            const cek = await KorluhPalawijaList.count({
                where: {
                    korluhPalawijaId,
                    korluhMasterPalawijaId: {
                        [Op.in]: [1, 2]
                    }
                }
            });
            if (!cek) {
                await KorluhPalawijaList.destroy({
                    where: {
                        korluhPalawijaId,
                        korluhMasterPalawijaId: 18,
                    }
                });
            }
        }
    }
    if ([5, 6].includes(korluhMasterPalawijaId)) {
        await parentSync(19, obj, bef);
        if (deleted) {
            const cek = await KorluhPalawijaList.count({
                where: {
                    korluhPalawijaId,
                    korluhMasterPalawijaId: {
                        [Op.in]: [5, 6]
                    }
                }
            });
            if (!cek) {
                await KorluhPalawijaList.destroy({
                    where: {
                        korluhPalawijaId,
                        korluhMasterPalawijaId: 19,
                    }
                });
            }
        }
    }
    if ([8, 9].includes(korluhMasterPalawijaId)) {
        await parentSync(20, obj, bef);
        if (deleted) {
            const cek = await KorluhPalawijaList.count({
                where: {
                    korluhPalawijaId,
                    korluhMasterPalawijaId: {
                        [Op.in]: [8, 9]
                    }
                }
            });
            if (!cek) {
                await KorluhPalawijaList.destroy({
                    where: {
                        korluhPalawijaId,
                        korluhMasterPalawijaId: 20,
                    }
                });
            }
        }
    }
}

const coreSchema = {
    lahan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_sawah_panen_hijauan_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_bukan_sawah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_bukan_sawah_panen_muda: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_bukan_sawah_panen_hijauan_pakan_ternak: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_bukan_sawah_tanam: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_bukan_sawah_puso: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi: {
        type: "number",
        optional: true,
        convert: true,
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
                tanggal: {
                    type: "date",
                    convert: true,
                },
                korluh_master_palawija_id: {
                    type: "number",
                    positive: true,
                    integer: true,
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
                kecamatan_id,
                tanggal,
                korluh_master_palawija_id,
                lahan_sawah_panen,
                lahan_sawah_panen_muda,
                lahan_sawah_panen_hijauan_pakan_ternak,
                lahan_sawah_tanam,
                lahan_sawah_puso,
                lahan_bukan_sawah_panen,
                lahan_bukan_sawah_panen_muda,
                lahan_bukan_sawah_panen_hijauan_pakan_ternak,
                lahan_bukan_sawah_tanam,
                lahan_bukan_sawah_puso,
                produksi,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);

            const korluhMasterPalawija = await KorluhMasterPalawija.findOne({
                where: {
                    id: korluh_master_palawija_id,
                    hide: { [Op.ne]: true }
                }
            });

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
            if (!korluhMasterPalawija) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Korluh master palawija doesn't exists",
                        field: 'korluh_master_palawija_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const korluhPalawija = await KorluhPalawija.findOrCreate({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    kecamatanId: kecamatan.id,
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    tanggal,
                }
            });

            const korluhPalawijaListExists = await KorluhPalawijaList.findOne({
                where: {
                    korluhMasterPalawijaId: korluhMasterPalawija.id,
                    korluhPalawijaId: korluhPalawija[0].id,
                }
            });

            if (korluhPalawijaListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created korluh palawija, please use another master",
                        field: 'korluh_master_palawija_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            let obj = fixedNumber({
                lahanSawahPanen: lahan_sawah_panen,
                lahanSawahPanenMuda: lahan_sawah_panen_muda,
                lahanSawahPanenHijauanPakanTernak: lahan_sawah_panen_hijauan_pakan_ternak,
                lahanSawahTanam: lahan_sawah_tanam,
                lahanSawahPuso: lahan_sawah_puso,
                lahanBukanSawahPanen: lahan_bukan_sawah_panen,
                lahanBukanSawahPanenMuda: lahan_bukan_sawah_panen_muda,
                lahanBukanSawahPanenHijauanPakanTernak: lahan_bukan_sawah_panen_hijauan_pakan_ternak,
                lahanBukanSawahTanam: lahan_bukan_sawah_tanam,
                lahanBukanSawahPuso: lahan_bukan_sawah_puso,
                produksi,
            });

            obj = {
                korluhMasterPalawijaId: korluhMasterPalawija.id,
                korluhPalawijaId: korluhPalawija[0].id,
                ...obj,
            };

            await KorluhPalawijaList.create(obj);

            await parentSynchronization(obj);

            await transaction.commit();

            res.status(201).json(response(201, 'Korluh palawija created'));
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
            let { kecamatan, equalDate, startDate, endDate, limit, bulan, tahun, page } = req.query;

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
            if (bulan || tahun) {
                offset = undefined;
                limit = undefined;

                tahun = !isNaN(parseInt(tahun)) ? parseInt(tahun) : new Date().getFullYear();
                bulan = !isNaN(parseInt(bulan)) ? parseInt(bulan) : new Date().getMonth() + 1;

                where = {
                    ...where,
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('tanggal')), bulan),
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

            let korluhPalawija = await KorluhPalawija.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: KorluhPalawijaList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterPalawija,
                                as: 'master'
                            }
                        ]
                    }
                ],
                offset,
                limit,
                where,
            });

            const count = await KorluhPalawija.count({ where });

            limit = limit || 1;

            const pagination = generatePagination(count, page, limit, '/api/korluh/palawija/get');

            korluhPalawija = korluhPalawija.map(item => {
                let temp = {
                    masterIds: [],
                };
                item.list.forEach(i => {
                    const idx = i.master.id;

                    temp[idx] = {
                        master: i.master
                    };
                    for (let idxVal of [
                        "lahanSawahPanen",
                        "lahanSawahPanenMuda",
                        "lahanSawahPanenHijauanPakanTernak",
                        "lahanSawahTanam",
                        "lahanSawahPuso",
                        "lahanBukanSawahPanen",
                        "lahanBukanSawahPanenMuda",
                        "lahanBukanSawahPanenHijauanPakanTernak",
                        "lahanBukanSawahTanam",
                        "lahanBukanSawahPuso",
                        "produksi",
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

            res.status(200).json(response(200, 'Get korluh palawija successfully', { data: korluhPalawija, pagination }));
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

            const korluhPalawijaList = await KorluhPalawijaList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhPalawija,
                        as: 'korluhPalawija',
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                            },
                        ],
                    },
                    {
                        model: KorluhMasterPalawija,
                        as: 'master',
                        where: {
                            hide: { [Op.ne]: true }
                        }
                    },
                ],
            });

            if (!korluhPalawijaList) {
                res.status(404).json(response(404, 'Korluh palawija not found'));
                return;
            }

            res.status(200).json(response(200, 'Get korluh palawija successfully', korluhPalawijaList));
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

            const korluhPalawijaList = await KorluhPalawijaList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhMasterPalawija,
                        as: 'master',
                        where: {
                            hide: { [Op.ne]: true }
                        }
                    },
                ],
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!korluhPalawijaList) {
                res.status(404).json(response(404, 'Korluh palawija not found'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const korluhPalawija = await KorluhPalawija.findByPk(korluhPalawijaList.korluhPalawijaId);

            if (!korluhPalawija) {
                res.status(404).json(response(404, 'Korluh palawija error'));
                return;
            }

            const tanggal = new Date(korluhPalawija.tanggal);

            let {
                lahan_sawah_panen,
                lahan_sawah_panen_muda,
                lahan_sawah_panen_hijauan_pakan_ternak,
                lahan_sawah_tanam,
                lahan_sawah_puso,
                lahan_bukan_sawah_panen,
                lahan_bukan_sawah_panen_muda,
                lahan_bukan_sawah_panen_hijauan_pakan_ternak,
                lahan_bukan_sawah_tanam,
                lahan_bukan_sawah_puso,
                produksi,
            } = req.body;

            const objBef = korluhPalawijaList;

            let obj = {
                korluhMasterPalawijaId: korluhPalawijaList.korluhMasterPalawijaId,
                korluhPalawijaId: korluhPalawijaList.korluhPalawijaId,
                lahanSawahPanen: lahan_sawah_panen,
                lahanSawahPanenMuda: lahan_sawah_panen_muda,
                lahanSawahPanenHijauanPakanTernak: lahan_sawah_panen_hijauan_pakan_ternak,
                lahanSawahTanam: lahan_sawah_tanam,
                lahanSawahPuso: lahan_sawah_puso,
                lahanBukanSawahPanen: lahan_bukan_sawah_panen,
                lahanBukanSawahPanenMuda: lahan_bukan_sawah_panen_muda,
                lahanBukanSawahPanenHijauanPakanTernak: lahan_bukan_sawah_panen_hijauan_pakan_ternak,
                lahanBukanSawahTanam: lahan_bukan_sawah_tanam,
                lahanBukanSawahPuso: lahan_bukan_sawah_puso,
                produksi,
            }

            obj = fixedNumber(obj);

            await korluhPalawijaList.update(obj);

            await parentSynchronization(obj, objBef);

            await transaction.commit();

            res.status(200).json(response(200, 'Update korluh palawija successfully'));
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

            const korluhPalawijaList = await KorluhPalawijaList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhMasterPalawija,
                        as: 'master',
                        where: {
                            hide: { [Op.ne]: true }
                        }
                    },
                ],
            });

            if (!korluhPalawijaList) {
                res.status(404).json(response(404, 'Korluh palawija not found'));
                return;
            }

            const korluhPalawijaId = korluhPalawijaList.korluhPalawijaId;

            const korluhPalawija = await KorluhPalawija.findByPk(korluhPalawijaId);

            if (!korluhPalawija) {
                res.status(404).json(response(404, 'Korluh palawija error'));
                return;
            }

            const objBef = korluhPalawijaList;
            const obj = {
                korluhMasterPalawijaId: objBef.korluhMasterPalawijaId,
                korluhPalawijaId: objBef.korluhPalawijaId,
            }

            await korluhPalawijaList.destroy();

            await parentSynchronization(obj, objBef, true);

            const korluhPalawijaExits = await KorluhPalawijaList.findOne({
                where: { korluhPalawijaId }
            });

            if (!korluhPalawijaExits) {
                await KorluhPalawija.destroy({
                    where: { id: korluhPalawijaId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete korluh palawija successfully'));
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