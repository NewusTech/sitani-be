const { TphRealisasiPalawija1List, TphRealisasiPalawija1, Kecamatan, sequelize } = require('../models');
const { dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    jagung_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    jagung_produksi: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    kedelai_produksi: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_tanah_produksi: {
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
                bulan: {
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
                kecamatan_id,
                bulan,
                jagung_panen,
                jagung_produktivitas,
                jagung_produksi,
                kedelai_panen,
                kedelai_produktivitas,
                kedelai_produksi,
                kacang_tanah_panen,
                kacang_tanah_produktivitas,
                kacang_tanah_produksi,
            } = req.body;

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

            bulan = dateGenerate(bulan);

            const tphRealisasiPalawija1 = await TphRealisasiPalawija1.findOrCreate({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                },
                defaults: {
                    bulan
                }
            });

            const tphRealisasiPalawija1ListExists = await TphRealisasiPalawija1List.findOne({
                where: {
                    tphRealisasiPalawija1Id: tphRealisasiPalawija1[0].id,
                    kecamatanId: kecamatan.id
                }
            });

            if (tphRealisasiPalawija1ListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created realisasi palawija 1, please use another kecamatan",
                        field: 'kecamatan_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await TphRealisasiPalawija1List.create({
                tphRealisasiPalawija1Id: tphRealisasiPalawija1[0].id,
                kecamatanId: kecamatan.id,
                jagungPanen: jagung_panen,
                jagungProduktivitas: jagung_produktivitas,
                jagungProduksi: jagung_produksi,
                kedelaiPanen: kedelai_panen,
                kedelaiProduktivitas: kedelai_produktivitas,
                kedelaiProduksi: kedelai_produksi,
                kacangTanahPanen: kacang_tanah_panen,
                kacangTanahProduktivitas: kacang_tanah_produktivitas,
                kacangTanahProduksi: kacang_tanah_produksi,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Realisasi palawija 1 created'));
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
            let { kecamatan, bulan } = req.query;

            bulan = !isNaN(new Date(bulan)) ? new Date(bulan) : new Date();

            let where = {};
            let listWhere = {};
            if (bulan) {
                where = {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('bulan')), bulan.getMonth() + 1),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('bulan')), bulan.getFullYear()),
                    ]
                };
            }
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                listWhere = {
                    'kecamatanId': parseInt(kecamatan)
                };
            }

            const tphRealisasiPalawija1 = await TphRealisasiPalawija1.findOne({
                include: [
                    {
                        model: TphRealisasiPalawija1List,
                        as: 'list',
                        where: listWhere,
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                                attributes: { exclude: ['createdAt', 'updatedAt'] },
                            }
                        ],
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                    }
                ],
                attributes: ['bulan'],
                where,
                order: [['bulan', 'DESC']],
            });

            let jagungPanen = jagungProduktivitas = jagungProduksi = kedelaiPanen = kedelaiProduktivitas = kedelaiProduksi = kacangTanahPanen = kacangTanahProduktivitas = kacangTanahProduksi = 0;

            if (tphRealisasiPalawija1?.list) {
                for (let temp of tphRealisasiPalawija1.list) {
                    if (temp?.jagungPanen) {
                        jagungPanen += temp.jagungPanen;
                    }
                    if (temp?.jagungProduktivitas) {
                        jagungProduktivitas += temp.jagungProduktivitas;
                    }
                    if (temp?.jagungProduksi) {
                        jagungProduksi += temp.jagungProduksi;
                    }
                    if (temp?.kedelaiPanen) {
                        kedelaiPanen += temp.kedelaiPanen;
                    }
                    if (temp?.kedelaiProduktivitas) {
                        kedelaiProduktivitas += temp.kedelaiProduktivitas;
                    }
                    if (temp?.kedelaiProduksi) {
                        kedelaiProduksi += temp.kedelaiProduksi;
                    }
                    if (temp?.kacangTanahPanen) {
                        kacangTanahPanen += temp.kacangTanahPanen;
                    }
                    if (temp?.kacangTanahProduktivitas) {
                        kacangTanahProduktivitas += temp.kacangTanahProduktivitas;
                    }
                    if (temp?.kacangTanahProduksi) {
                        kacangTanahProduksi += temp.kacangTanahProduksi;
                    }
                }
            }

            res.status(200).json(response(200, 'Get realisasi palawija 1 successfully', {
                detail: tphRealisasiPalawija1,
                jagungPanen,
                jagungProduktivitas,
                jagungProduksi,
                kedelaiPanen,
                kedelaiProduktivitas,
                kedelaiProduksi,
                kacangTanahPanen,
                kacangTanahProduktivitas,
                kacangTanahProduksi,
            }));
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

            const tphRealisasiPalawija1List = await TphRealisasiPalawija1List.findOne({
                where: { id },
                include: [
                    {
                        model: TphRealisasiPalawija1,
                        as: 'tphRealisasiPalawija1',
                    },
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!tphRealisasiPalawija1List) {
                res.status(404).json(response(404, 'Realisasi palawija 1 not found'));
                return;
            }

            res.status(200).json(response(200, 'Get realisasi palawija 1 successfully', tphRealisasiPalawija1List));
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

            const tphRealisasiPalawija1List = await TphRealisasiPalawija1List.findOne({
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

            if (!tphRealisasiPalawija1List) {
                res.status(404).json(response(404, 'Realisasi palawija 1 not found'));
                return;
            }

            let {
                jagung_panen,
                jagung_produktivitas,
                jagung_produksi,
                kedelai_panen,
                kedelai_produktivitas,
                kedelai_produksi,
                kacang_tanah_panen,
                kacang_tanah_produktivitas,
                kacang_tanah_produksi,
            } = req.body;

            await tphRealisasiPalawija1List.update({
                jagungPanen: jagung_panen,
                jagungProduktivitas: jagung_produktivitas,
                jagungProduksi: jagung_produksi,
                kedelaiPanen: kedelai_panen,
                kedelaiProduktivitas: kedelai_produktivitas,
                kedelaiProduksi: kedelai_produksi,
                kacangTanahPanen: kacang_tanah_panen,
                kacangTanahProduktivitas: kacang_tanah_produktivitas,
                kacangTanahProduksi: kacang_tanah_produksi,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update realisasi palawija 1 successfully'));
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

            const tphRealisasiPalawija1List = await TphRealisasiPalawija1List.findOne({
                where: { id },
            });

            if (!tphRealisasiPalawija1List) {
                res.status(404).json(response(404, 'Realisasi palawija 1 not found'));
                return;
            }

            const tphRealisasiPalawija1Id = tphRealisasiPalawija1List.tphRealisasiPalawija1Id;

            await tphRealisasiPalawija1List.destroy();

            const tphRealisasiPalawija1ListExists = await TphRealisasiPalawija1List.findOne({
                where: { tphRealisasiPalawija1Id }
            });

            if (!tphRealisasiPalawija1ListExists) {
                await TphRealisasiPalawija1.destroy({
                    where: { id: tphRealisasiPalawija1Id }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete realisasi palawija 1 successfully'));
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