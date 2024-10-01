const { TphRealisasiPalawija2List, TphRealisasiPalawija2, Kecamatan, sequelize } = require('../models');
const { customMessages, dateGenerate, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages
});

const coreSchema = {
    kacang_hijau_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    kacang_hijau_produksi: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_kayu_produksi: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_panen: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    ubi_jalar_produksi: {
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
                kacang_hijau_panen,
                kacang_hijau_produktivitas,
                kacang_hijau_produksi,
                ubi_kayu_panen,
                ubi_kayu_produktivitas,
                ubi_kayu_produksi,
                ubi_jalar_panen,
                ubi_jalar_produktivitas,
                ubi_jalar_produksi,
            } = req.body;

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

            bulan = dateGenerate(bulan);

            const tphRealisasiPalawija2 = await TphRealisasiPalawija2.findOrCreate({
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

            const tphRealisasiPalawija2ListExists = await TphRealisasiPalawija2List.findOne({
                where: {
                    tphRealisasiPalawija2Id: tphRealisasiPalawija2[0].id,
                    kecamatanId: kecamatan.id
                }
            });

            if (tphRealisasiPalawija2ListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Tidak dapat menambahkan realisasi palawija 2, kecamatan sudah digunakan",
                        field: 'kecamatan_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await TphRealisasiPalawija2List.create({
                tphRealisasiPalawija2Id: tphRealisasiPalawija2[0].id,
                kecamatanId: kecamatan.id,
                kacangHijauPanen: kacang_hijau_panen,
                kacangHijauProduktivitas: kacang_hijau_produktivitas,
                kacangHijauProduksi: kacang_hijau_produksi,
                ubiKayuPanen: ubi_kayu_panen,
                ubiKayuProduktivitas: ubi_kayu_produktivitas,
                ubiKayuProduksi: ubi_kayu_produksi,
                ubiJalarPanen: ubi_jalar_panen,
                ubiJalarProduktivitas: ubi_jalar_produktivitas,
                ubiJalarProduksi: ubi_jalar_produksi,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Realisasi palawija 2 berhasil ditambahkan'));
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

            const tphRealisasiPalawija2 = await TphRealisasiPalawija2.findOne({
                include: [
                    {
                        model: TphRealisasiPalawija2List,
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

            let kacangHijauPanen = kacangHijauProduktivitas = kacangHijauProduksi = ubiKayuPanen = ubiKayuProduktivitas = ubiKayuProduksi = ubiJalarPanen = ubiJalarProduktivitas = ubiJalarProduksi = 0;

            if (tphRealisasiPalawija2?.list) {
                for (let temp of tphRealisasiPalawija2.list) {
                    if (temp?.kacangHijauPanen) {
                        kacangHijauPanen += temp.kacangHijauPanen;
                    }
                    if (temp?.kacangHijauProduktivitas) {
                        kacangHijauProduktivitas += temp.kacangHijauProduktivitas;
                    }
                    if (temp?.kacangHijauProduksi) {
                        kacangHijauProduksi += temp.kacangHijauProduksi;
                    }
                    if (temp?.ubiKayuPanen) {
                        ubiKayuPanen += temp.ubiKayuPanen;
                    }
                    if (temp?.ubiKayuProduktivitas) {
                        ubiKayuProduktivitas += temp.ubiKayuProduktivitas;
                    }
                    if (temp?.ubiKayuProduksi) {
                        ubiKayuProduksi += temp.ubiKayuProduksi;
                    }
                    if (temp?.ubiJalarPanen) {
                        ubiJalarPanen += temp.ubiJalarPanen;
                    }
                    if (temp?.ubiJalarProduktivitas) {
                        ubiJalarProduktivitas += temp.ubiJalarProduktivitas;
                    }
                    if (temp?.ubiJalarProduksi) {
                        ubiJalarProduksi += temp.ubiJalarProduksi;
                    }
                }
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar realisasi palawija 2', {
                detail: tphRealisasiPalawija2,
                kacangHijauPanen,
                kacangHijauProduktivitas,
                kacangHijauProduksi,
                ubiKayuPanen,
                ubiKayuProduktivitas,
                ubiKayuProduksi,
                ubiJalarPanen,
                ubiJalarProduktivitas,
                ubiJalarProduksi,
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

            const tphRealisasiPalawija2List = await TphRealisasiPalawija2List.findOne({
                where: { id },
                include: [
                    {
                        model: TphRealisasiPalawija2,
                        as: 'tphRealisasiPalawija2',
                    },
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!tphRealisasiPalawija2List) {
                res.status(404).json(response(404, 'Realisasi palawija 2 tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan realisasi palawija 2', tphRealisasiPalawija2List));
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

            const tphRealisasiPalawija2List = await TphRealisasiPalawija2List.findOne({
                where: { id },
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!tphRealisasiPalawija2List) {
                res.status(404).json(response(404, 'Realisasi palawija 2 tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kacang_hijau_panen,
                kacang_hijau_produktivitas,
                kacang_hijau_produksi,
                ubi_kayu_panen,
                ubi_kayu_produktivitas,
                ubi_kayu_produksi,
                ubi_jalar_panen,
                ubi_jalar_produktivitas,
                ubi_jalar_produksi,
            } = req.body;

            await tphRealisasiPalawija2List.update({
                kacangHijauPanen: kacang_hijau_panen,
                kacangHijauProduktivitas: kacang_hijau_produktivitas,
                kacangHijauProduksi: kacang_hijau_produksi,
                ubiKayuPanen: ubi_kayu_panen,
                ubiKayuProduktivitas: ubi_kayu_produktivitas,
                ubiKayuProduksi: ubi_kayu_produksi,
                ubiJalarPanen: ubi_jalar_panen,
                ubiJalarProduktivitas: ubi_jalar_produktivitas,
                ubiJalarProduksi: ubi_jalar_produksi,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui realisasi palawija 2'));
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

            const tphRealisasiPalawija2List = await TphRealisasiPalawija2List.findOne({
                where: { id },
            });

            if (!tphRealisasiPalawija2List) {
                res.status(404).json(response(404, 'Realisasi palawija 2 tidak dapat ditemukan'));
                return;
            }

            const tphRealisasiPalawija2Id = tphRealisasiPalawija2List.tphRealisasiPalawija2Id;

            await tphRealisasiPalawija2List.destroy();

            const tphRealisasiPalawija2ListExists = await TphRealisasiPalawija2List.findOne({
                where: { tphRealisasiPalawija2Id }
            });

            if (!tphRealisasiPalawija2ListExists) {
                await TphRealisasiPalawija2.destroy({
                    where: { id: tphRealisasiPalawija2Id }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus realisasi palawija 2'));
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