const { TphLahanSawahList, TphLahanSawah, Kecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    irigasi_teknis: {
        type: "number",
        optional: true,
        convert: true,
    },
    irigasi_setengah_teknis: {
        type: "number",
        optional: true,
        convert: true,
    },
    irigasi_sederhana: {
        type: "number",
        optional: true,
        convert: true,
    },
    irigasi_desa: {
        type: "number",
        optional: true,
        convert: true,
    },
    tadah_hujan: {
        type: "number",
        optional: true,
        convert: true,
    },
    pasang_surut: {
        type: "number",
        optional: true,
        convert: true,
    },
    lebak: {
        type: "number",
        optional: true,
        convert: true,
    },
    lainnya: {
        type: "number",
        optional: true,
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
                irigasi_teknis,
                irigasi_setengah_teknis,
                irigasi_sederhana,
                irigasi_desa,
                tadah_hujan,
                pasang_surut,
                lebak,
                lainnya,
                keterangan,
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

            const tphLahanSawah = await TphLahanSawah.findOrCreate({
                where: {
                    tahun,
                },
                defaults: {
                    tahun
                }
            });

            const tphLahanSawahListExists = await TphLahanSawahList.findOne({
                where: {
                    tphLahanSawahId: tphLahanSawah[0].id,
                    kecamatanId: kecamatan.id
                }
            });

            if (tphLahanSawahListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created lahan sawah, please use another kecamatan",
                        field: 'kecamatan_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            let sum = 0;
            for (let temp of [
                irigasi_teknis,
                irigasi_setengah_teknis,
                irigasi_sederhana,
                irigasi_desa,
                tadah_hujan,
                pasang_surut,
                lebak,
                lainnya,
            ]) {
                if (temp) {
                    sum += temp;
                }
            }

            await TphLahanSawahList.create({
                tphLahanSawahId: tphLahanSawah[0].id,
                kecamatanId: kecamatan.id,
                jumlah: sum,
                irigasiSetengahTeknis: irigasi_setengah_teknis,
                irigasiSederhana: irigasi_sederhana,
                irigasiTeknis: irigasi_teknis,
                irigasiDesa: irigasi_desa,
                pasangSurut: pasang_surut,
                tadahHujan: tadah_hujan,
                keterangan,
                lainnya,
                lebak,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Lahan sawah created'));
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

            const tphLahanSawah = await TphLahanSawah.findOne({
                include: [
                    {
                        model: TphLahanSawahList,
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

            let jumlahIrigasiSetengahTeknis = jumlahIrigasiSederhana = jumlahIrigasiTeknis = jumlahIrigasiDesa = jumlahPasangSurut = jumlahTadahHujan = jumlahLainnya = jumlahLebak = jumlah = 0;

            if (tphLahanSawah?.list) {
                for (let temp of tphLahanSawah.list) {
                    if (temp?.irigasiSetengahTeknis) {
                        jumlahIrigasiSetengahTeknis += temp.irigasiSetengahTeknis;
                    }
                    if (temp?.irigasiSederhana) {
                        jumlahIrigasiSederhana += temp.irigasiSederhana;
                    }
                    if (temp?.irigasiTeknis) {
                        jumlahIrigasiTeknis += temp.irigasiTeknis;
                    }
                    if (temp?.irigasiDesa) {
                        jumlahIrigasiDesa += temp.irigasiDesa;
                    }
                    if (temp?.pasangSurut) {
                        jumlahPasangSurut += temp.pasangSurut;
                    }
                    if (temp?.tadahHujan) {
                        jumlahTadahHujan += temp.tadahHujan;
                    }
                    if (temp?.lainnya) {
                        jumlahLainnya += temp.lainnya;
                    }
                    if (temp?.lebak) {
                        jumlahLebak += temp.lebak;
                    }
                    if (temp?.jumlah) {
                        jumlah += temp.jumlah;
                    }
                }
            }

            res.status(200).json(response(200, 'Get lahan sawah successfully', {
                detail: tphLahanSawah,
                jumlahIrigasiSetengahTeknis,
                jumlahIrigasiSederhana,
                jumlahIrigasiTeknis,
                jumlahIrigasiDesa,
                jumlahPasangSurut,
                jumlahTadahHujan,
                jumlahLainnya,
                jumlahLebak,
                jumlah,
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

            const tphLahanSawahList = await TphLahanSawahList.findOne({
                where: { id },
                include: [
                    {
                        model: TphLahanSawah,
                        as: 'tphLahanSawah',
                    },
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
            });

            if (!tphLahanSawahList) {
                res.status(404).json(response(404, 'Lahan sawah not found'));
                return;
            }

            res.status(200).json(response(200, 'Get lahan sawah successfully', tphLahanSawahList));
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

            const tphLahanSawahList = await TphLahanSawahList.findOne({
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

            if (!tphLahanSawahList) {
                res.status(404).json(response(404, 'Lahan sawah not found'));
                return;
            }

            let {
                irigasi_teknis,
                irigasi_setengah_teknis,
                irigasi_sederhana,
                irigasi_desa,
                tadah_hujan,
                pasang_surut,
                lebak,
                lainnya,
                keterangan,
            } = req.body;

            let sum = 0;
            for (let temp of [
                irigasi_teknis,
                irigasi_setengah_teknis,
                irigasi_sederhana,
                irigasi_desa,
                tadah_hujan,
                pasang_surut,
                lebak,
                lainnya,
            ]) {
                if (temp) {
                    sum += temp;
                }
            }

            await tphLahanSawahList.update({
                jumlah: sum,
                irigasiSetengahTeknis: irigasi_setengah_teknis,
                irigasiSederhana: irigasi_sederhana,
                irigasiTeknis: irigasi_teknis,
                irigasiDesa: irigasi_desa,
                pasangSurut: pasang_surut,
                tadahHujan: tadah_hujan,
                keterangan,
                lainnya,
                lebak,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update lahan sawah successfully'));
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

            const tphLahanSawahList = await TphLahanSawahList.findOne({
                where: { id },
            });

            if (!tphLahanSawahList) {
                res.status(404).json(response(404, 'Lahan sawah not found'));
                return;
            }

            const tphLahanSawahId = tphLahanSawahList.tphLahanSawahId;

            await tphLahanSawahList.destroy();

            const tphLahanSawahListExists = await TphLahanSawahList.findOne({
                where: { tphLahanSawahId }
            });

            if (!tphLahanSawahListExists) {
                await TphLahanSawah.destroy({
                    where: { id: tphLahanSawahId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete lahan sawah successfully'));
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