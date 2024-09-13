const { TphLahanBukanSawahList, TphLahanBukanSawah, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    tegal: {
        type: "number",
        optional: true,
        convert: true,
    },
    ladang: {
        type: "number",
        optional: true,
        convert: true,
    },
    perkebunan: {
        type: "number",
        optional: true,
        convert: true,
    },
    hutan_rakyat: {
        type: "number",
        optional: true,
        convert: true,
    },
    padang_pengembalaan_rumput: {
        type: "number",
        optional: true,
        convert: true,
    },
    hutan_negara: {
        type: "number",
        optional: true,
        convert: true,
    },
    smt_tidak_diusahakan: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya: {
        type: "number",
        optional: true,
        convert: true,
    },
    lahan_bukan_pertanian: {
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
                tegal,
                ladang,
                perkebunan,
                hutan_rakyat,
                padang_pengembalaan_rumput,
                hutan_negara,
                smt_tidak_diusahakan,
                lainnya,
                lahan_bukan_pertanian,
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

            const tphLahanBukanSawah = await TphLahanBukanSawah.findOrCreate({
                where: {
                    tahun,
                },
                defaults: {
                    tahun
                }
            });

            const tphLahanBukanSawahListExists = await TphLahanBukanSawahList.findOne({
                where: {
                    tphLahanBukanSawahId: tphLahanBukanSawah[0].id,
                    kecamatanId: kecamatan.id
                }
            });

            if (tphLahanBukanSawahListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created lahan bukan sawah, please use another kecamatan",
                        field: 'kecamatan_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            let sum = 0;
            for (let temp of [
                tegal,
                ladang,
                perkebunan,
                hutan_rakyat,
                padang_pengembalaan_rumput,
                hutan_negara,
                smt_tidak_diusahakan,
                lainnya,
            ]) {
                if (temp) {
                    sum += temp;
                }
            }

            await TphLahanBukanSawahList.create({
                tphLahanBukanSawahId: tphLahanBukanSawah[0].id,
                kecamatanId: kecamatan.id,
                total: lahan_bukan_pertanian ? sum + lahan_bukan_pertanian : sum,
                jumlahLahanBukanSawah: sum,
                padangPengembalaanRumput: padang_pengembalaan_rumput,
                smtTidakDiusahakan: smt_tidak_diusahakan,
                hutanNegara: hutan_negara,
                hutanRakyat: hutan_rakyat,
                lainnya: lainnya,
                perkebunan,
                ladang,
                tegal,
                lahanBukanPertanian: lahan_bukan_pertanian,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Lahan bukan sawah created'));
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

            const tphLahanBukanSawah = await TphLahanBukanSawah.findOne({
                include: [
                    {
                        model: TphLahanBukanSawahList,
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

            let total = jumlahLahanBukanSawah = padangPengembalaanRumput = smtTidakDiusahakan = hutanNegara = hutanRakyat = lainnya = perkebunan = ladang = tegal = lahanBukanPertanian = 0;

            if (tphLahanBukanSawah?.list) {
                for (let temp of tphLahanBukanSawah.list) {
                    if (temp?.total) {
                        total += temp.total;
                    }
                    if (temp?.jumlahLahanBukanSawah) {
                        jumlahLahanBukanSawah += temp.jumlahLahanBukanSawah;
                    }
                    if (temp?.padangPengembalaanRumput) {
                        padangPengembalaanRumput += temp.padangPengembalaanRumput;
                    }
                    if (temp?.smtTidakDiusahakan) {
                        smtTidakDiusahakan += temp.smtTidakDiusahakan;
                    }
                    if (temp?.hutanNegara) {
                        hutanNegara += temp.hutanNegara;
                    }
                    if (temp?.hutanRakyat) {
                        hutanRakyat += temp.hutanRakyat;
                    }
                    if (temp?.lainnya) {
                        lainnya += temp.lainnya;
                    }
                    if (temp?.perkebunan) {
                        perkebunan += temp.perkebunan;
                    }
                    if (temp?.ladang) {
                        ladang += temp.ladang;
                    }
                    if (temp?.tegal) {
                        tegal += temp.tegal;
                    }
                    if (temp?.lahanBukanPertanian) {
                        lahanBukanPertanian += temp.lahanBukanPertanian;
                    }
                }
            }

            res.status(200).json(response(200, 'Get lahan bukan sawah successfully', {
                detail: tphLahanBukanSawah,
                total,
                jumlahLahanBukanSawah,
                padangPengembalaanRumput,
                smtTidakDiusahakan,
                hutanNegara,
                hutanRakyat,
                lainnya,
                perkebunan,
                ladang,
                tegal,
                lahanBukanPertanian,
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

            const tphLahanBukanSawahList = await TphLahanBukanSawahList.findOne({
                where: { id },
                include: [
                    {
                        model: TphLahanBukanSawah,
                        as: 'tphLahanBukanSawah',
                    },
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!tphLahanBukanSawahList) {
                res.status(404).json(response(404, 'Lahan bukan sawah not found'));
                return;
            }

            res.status(200).json(response(200, 'Get lahan bukan sawah successfully', tphLahanBukanSawahList));
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

            const tphLahanBukanSawahList = await TphLahanBukanSawahList.findOne({
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

            if (!tphLahanBukanSawahList) {
                res.status(404).json(response(404, 'Lahan bukan sawah not found'));
                return;
            }

            let {
                tegal,
                ladang,
                perkebunan,
                hutan_rakyat,
                padang_pengembalaan_rumput,
                hutan_negara,
                smt_tidak_diusahakan,
                lainnya,
                lahan_bukan_pertanian,
            } = req.body;

            let sum = 0;
            for (let temp of [
                tegal,
                ladang,
                perkebunan,
                hutan_rakyat,
                padang_pengembalaan_rumput,
                hutan_negara,
                smt_tidak_diusahakan,
                lainnya,
            ]) {
                if (temp) {
                    sum += temp;
                }
            }

            await tphLahanBukanSawahList.update({
                total: lahan_bukan_pertanian ? sum + lahan_bukan_pertanian : sum,
                jumlahLahanBukanSawah: sum,
                padangPengembalaanRumput: padang_pengembalaan_rumput,
                smtTidakDiusahakan: smt_tidak_diusahakan,
                hutanNegara: hutan_negara,
                hutanRakyat: hutan_rakyat,
                lainnya: lainnya,
                perkebunan,
                ladang,
                tegal,
                lahanBukanPertanian: lahan_bukan_pertanian,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update lahan bukan sawah successfully'));
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

            const tphLahanBukanSawahList = await TphLahanBukanSawahList.findOne({
                where: { id },
            });

            if (!tphLahanBukanSawahList) {
                res.status(404).json(response(404, 'Lahan bukan sawah not found'));
                return;
            }

            const tphLahanBukanSawahId = tphLahanBukanSawahList.tphLahanBukanSawahId;

            await tphLahanBukanSawahList.destroy();

            const tphLahanBukanSawahListExists = await TphLahanBukanSawahList.findOne({
                where: { tphLahanBukanSawahId }
            });

            if (!tphLahanBukanSawahListExists) {
                await TphLahanBukanSawah.destroy({
                    where: { id: tphLahanBukanSawahId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete lahan bukan sawah successfully'));
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