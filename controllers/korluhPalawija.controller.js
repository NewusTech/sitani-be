const { KorluhMasterPalawija, KorluhPalawijaList, KorluhPalawija, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

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

            const {
                kecamatan_id,
                desa_id,
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
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

            const korluhMasterPalawija = await KorluhMasterPalawija.findByPk(korluh_master_palawija_id, {
                include: [
                    {
                        model: KorluhMasterPalawija,
                        as: 'anak',
                    }
                ]
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
            if (korluhMasterPalawija.anak.length) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'errorType',
                        message: "Do not use parent of master palawija",
                        field: 'korluh_master_palawija_id',
                    },
                ]));
                return;
            }

            const korluhPalawija = await KorluhPalawija.findOrCreate({
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

            await KorluhPalawijaList.create({
                korluhMasterPalawijaId: korluhMasterPalawija.id,
                korluhPalawijaId: korluhPalawija[0].id,
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
            });

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
                if (equalDate instanceof Date && !isNaN(equalDate)) {
                    where.tanggal = { [Op.eq]: equalDate };
                }
            } else {
                if (startDate) {
                    startDate = new Date(startDate);
                    if (startDate instanceof Date && !isNaN(startDate)) {
                        where.tanggal = { [Op.gte]: startDate };
                    }
                }
                if (endDate) {
                    endDate = new Date(endDate);
                    if (endDate instanceof Date && !isNaN(endDate)) {
                        where.tanggal = { ...where.tanggal, [Op.lte]: endDate };
                    }
                }
            }

            const korluhPalawija = await KorluhPalawija.findAll({
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

            const pagination = generatePagination(count, page, limit, '/api/korluh/palawija/get');

            res.status(200).json(response(200, 'Get korluh palawija successfully', { data: korluhPalawija, pagination }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}