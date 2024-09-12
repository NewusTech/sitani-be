const { TphRealisasiPadiList, TphRealisasiPadi, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    panen_lahan_sawah: {
        type: "number",
        optional: true,
        convert: true,
    },
    produktivitas_lahan_sawah: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi_lahan_sawah: {
        type: "number",
        optional: true,
        convert: true,
    },
    panen_lahan_kering: {
        type: "number",
        optional: true,
        convert: true,
    },
    produktivitas_lahan_kering: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi_lahan_kering: {
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
                tahun: {
                    type: "number",
                    convert: true,
                    max: 9999,
                    min: 1111,
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
                tahun,
                panen_lahan_sawah,
                produktivitas_lahan_sawah,
                produksi_lahan_sawah,
                panen_lahan_kering,
                produktivitas_lahan_kering,
                produksi_lahan_kering,
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

            const tphRealisasiPadi = await TphRealisasiPadi.findOrCreate({
                where: {
                    tahun,
                },
                defaults: {
                    tahun
                }
            });

            const tphRealisasiPadiListExists = await TphRealisasiPadiList.findOne({
                where: {
                    tphRealisasiPadiId: tphRealisasiPadi[0].id,
                    kecamatanId: kecamatan.id
                }
            });

            if (tphRealisasiPadiListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created realisasi padi, please use another kecamatan",
                        field: 'kecamatan_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            let panenTotal = 0, produktivitasTotal = 0, produksiTotal = 0;

            for (let temp of [
                panen_lahan_sawah,
                panen_lahan_kering,
            ]) {
                if (temp) {
                    panenTotal += temp;
                }
            }

            for (let temp of [
                produktivitas_lahan_sawah,
                produktivitas_lahan_kering,
            ]) {
                if (temp) {
                    produktivitasTotal += temp;
                }
            }

            for (let temp of [
                produksi_lahan_sawah,
                produksi_lahan_kering,
            ]) {
                if (temp) {
                    produksiTotal += temp;
                }
            }

            await TphRealisasiPadiList.create({
                tphRealisasiPadiId: tphRealisasiPadi[0].id,
                kecamatanId: kecamatan.id,
                produktivitasLahanKering: produktivitas_lahan_kering,
                produktivitasLahanSawah: produktivitas_lahan_sawah,
                produksiLahanKering: produksi_lahan_kering,
                produksiLahanSawah: produksi_lahan_sawah,
                panenLahanKering: panen_lahan_kering,
                panenLahanSawah: panen_lahan_sawah,
                produktivitasTotal,
                produksiTotal,
                panenTotal,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Realisasi padi created'));
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
            let { kecamatan, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);

            let where = {};
            if (year) {
                where.tahun = year;
            }
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                where = {
                    ...where,
                    '$list.kecamatan.id$': parseInt(kecamatan)
                };
            }

            const tphRealisasiPadi = await TphRealisasiPadi.findOne({
                include: [
                    {
                        model: TphRealisasiPadiList,
                        as: 'list',
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
                attributes: ['tahun'],
                where,
                order: [['tahun', 'DESC']],
            });

            let produktivitasLahanKering = produktivitasLahanSawah = produksiLahanKering = produksiLahanSawah = panenLahanKering = panenLahanSawah = produktivitasTotal = produksiTotal = panenTotal = 0;

            if (tphRealisasiPadi?.list) {
                for (let temp of tphRealisasiPadi.list) {
                    if (temp?.produktivitasLahanKering) {
                        produktivitasLahanKering += temp.produktivitasLahanKering;
                    }
                    if (temp?.produktivitasLahanSawah) {
                        produktivitasLahanSawah += temp.produktivitasLahanSawah;
                    }
                    if (temp?.produksiLahanKering) {
                        produksiLahanKering += temp.produksiLahanKering;
                    }
                    if (temp?.produksiLahanSawah) {
                        produksiLahanSawah += temp.produksiLahanSawah;
                    }
                    if (temp?.panenLahanKering) {
                        panenLahanKering += temp.panenLahanKering;
                    }
                    if (temp?.panenLahanSawah) {
                        panenLahanSawah += temp.panenLahanSawah;
                    }
                    if (temp?.produktivitasTotal) {
                        produktivitasTotal += temp.produktivitasTotal;
                    }
                    if (temp?.produksiTotal) {
                        produksiTotal += temp.produksiTotal;
                    }
                    if (temp?.panenTotal) {
                        panenTotal += temp.panenTotal;
                    }
                }
            }

            res.status(200).json(response(200, 'Get realisasi padi successfully', {
                detail: tphRealisasiPadi,
                produktivitasLahanKering,
                produktivitasLahanSawah,
                produksiLahanKering,
                produksiLahanSawah,
                panenLahanKering,
                panenLahanSawah,
                produktivitasTotal,
                produksiTotal,
                panenTotal,
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

            const tphRealisasiPadiList = await TphRealisasiPadiList.findOne({
                where: { id },
                include: [
                    {
                        model: TphRealisasiPadi,
                        as: 'tphRealisasiPadi',
                    },
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!tphRealisasiPadiList) {
                res.status(404).json(response(404, 'Realisasi padi not found'));
                return;
            }

            res.status(200).json(response(200, 'Get realisasi padi successfully', tphRealisasiPadiList));
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

            const tphRealisasiPadiList = await TphRealisasiPadiList.findOne({
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

            if (!tphRealisasiPadiList) {
                res.status(404).json(response(404, 'Realisasi padi not found'));
                return;
            }

            let {
                panen_lahan_sawah,
                produktivitas_lahan_sawah,
                produksi_lahan_sawah,
                panen_lahan_kering,
                produktivitas_lahan_kering,
                produksi_lahan_kering,
            } = req.body;

            let panenTotal = 0, produktivitasTotal = 0, produksiTotal = 0;

            for (let temp of [
                panen_lahan_sawah,
                panen_lahan_kering,
            ]) {
                if (temp) {
                    panenTotal += temp;
                }
            }

            for (let temp of [
                produktivitas_lahan_sawah,
                produktivitas_lahan_kering,
            ]) {
                if (temp) {
                    produktivitasTotal += temp;
                }
            }

            for (let temp of [
                produksi_lahan_sawah,
                produksi_lahan_kering,
            ]) {
                if (temp) {
                    produksiTotal += temp;
                }
            }

            await tphRealisasiPadiList.update({
                produktivitasLahanKering: produktivitas_lahan_kering,
                produktivitasLahanSawah: produktivitas_lahan_sawah,
                produksiLahanKering: produksi_lahan_kering,
                produksiLahanSawah: produksi_lahan_sawah,
                panenLahanKering: panen_lahan_kering,
                panenLahanSawah: panen_lahan_sawah,
                produktivitasTotal,
                produksiTotal,
                panenTotal,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update realisasi padi successfully'));
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

            const tphRealisasiPadiList = await TphRealisasiPadiList.findOne({
                where: { id },
            });

            if (!tphRealisasiPadiList) {
                res.status(404).json(response(404, 'Realisasi padi not found'));
                return;
            }

            const tphRealisasiPadiId = tphRealisasiPadiList.tphRealisasiPadiId;

            await tphRealisasiPadiList.destroy();

            const tphRealisasiPadiListExists = await TphRealisasiPadiList.findOne({
                where: { tphRealisasiPadiId }
            });

            if (!tphRealisasiPadiListExists) {
                await TphRealisasiPadi.destroy({
                    where: { id: tphRealisasiPadiId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete realisasi padi successfully'));
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