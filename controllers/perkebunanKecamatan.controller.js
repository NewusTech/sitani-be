const {
    PerkebunanMasterKategoriKomoditas,
    PerkebunanMasterKomoditas,
    PerkebunanKecamatanList,
    PerkebunanKecamatan,
    Kecamatan,
    sequelize
} = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    tbm: {
        type: "number",
        optional: true,
        convert: true,
    },
    tm: {
        type: "number",
        optional: true,
        convert: true,
    },
    tr: {
        type: "number",
        optional: true,
        convert: true,
    },
    produksi: {
        type: "number",
        optional: true,
        convert: true,
    },
    produktivitas: {
        type: "number",
        optional: true,
        convert: true,
    },
    jml_petani_pekebun: {
        type: "number",
        optional: true,
        convert: true,
    },
    bentuk_hasil: {
        type: "string",
        optional: true,
        max: 255,
    },
    keterangan: {
        type: "string",
        optional: true,
        max: 255,
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
                master_kategori_komoditas_id: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
                master_komoditas_id: {
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
                tahun,
                master_kategori_komoditas_id,
                master_komoditas_id,
                tbm,
                tm,
                tr,
                produksi,
                produktivitas,
                jml_petani_pekebun,
                bentuk_hasil,
                keterangan,
            } = req.body;

            const masterKategoriKomoditas = await PerkebunanMasterKategoriKomoditas.findByPk(master_kategori_komoditas_id);
            const masterKomoditas = await PerkebunanMasterKomoditas.findByPk(master_komoditas_id);
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

            if (!masterKomoditas) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Master komoditas doesn't exists",
                        field: 'master_komoditas_id',
                    },
                ]));
                return;
            }

            if (!masterKategoriKomoditas) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Master kategori komoditas doesn't exists",
                        field: 'master_kategori_komoditas_id',
                    },
                ]));
                return;
            }

            const perkebunanKecamatan = await PerkebunanKecamatan.findOrCreate({
                where: {
                    kecamatanId: kecamatan.id,
                    tahun,
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    tahun,
                }
            });

            const perkebunanKecamatanListExists = await PerkebunanKecamatanList.findOne({
                where: {
                    perkebunanKecamatanId: perkebunanKecamatan[0].id,
                    masterKategoriKomoditasId: masterKategoriKomoditas.id,
                    masterKomoditasId: masterKomoditas.id,
                }
            });

            if (perkebunanKecamatanListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Cannot created perkebunan, please use another master komoditas",
                        field: 'master_komoditas_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            let jumlah = 0;
            for (let temp of [
                tbm,
                tm,
                tr,
            ]) {
                if (temp) {
                    jumlah += temp;
                }
            }

            await PerkebunanKecamatanList.create({
                perkebunanKecamatanId: perkebunanKecamatan[0].id,
                masterKategoriKomoditasId: masterKategoriKomoditas.id,
                masterKomoditasId: masterKomoditas.id,
                tbm,
                tm,
                tr,
                jumlah,
                produksi,
                produktivitas,
                jmlPetaniPekebun: jml_petani_pekebun,
                bentukHasil: bentuk_hasil,
                keterangan,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Perkebunan created'));
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
            let { kecamatan, limit, page, year } = req.query;

            year = isNaN(parseInt(year)) ? new Date().getFullYear() : parseInt(year);
            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            const offset = (page - 1) * limit;

            let where = {};
            if (year) {
                where.tahun = year;
            }
            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }

            let perkebunanKecamatan = await PerkebunanKecamatan.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: PerkebunanKecamatanList,
                        as: 'list',
                        include: [
                            {
                                model: PerkebunanMasterKategoriKomoditas,
                                as: 'kategoriKomoditas'
                            },
                            {
                                model: PerkebunanMasterKomoditas,
                                as: 'komoditas'
                            },
                        ],
                    }
                ],
                order: [['createdAt', 'DESC']],
                offset,
                limit,
                where,
            });

            const count = await PerkebunanKecamatan.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/perkebunan/kecamatan/get');

            perkebunanKecamatan = perkebunanKecamatan.map(item => {
                let list = {};
                for (let i of item.list) {
                    list['sumJumlah'] = list['sumJumlah'] ? list['sumJumlah'] + i.jumlah : i.jumlah || 0;
                    list['sumTbm'] = list['sumTbm'] ? list['sumTbm'] + i.tbm : i.tbm || 0;
                    list['sumTm'] = list['sumTm'] ? list['sumTm'] + i.tm : i.tm || 0;
                    list['sumTr'] = list['sumTr'] ? list['sumTr'] + i.tr : i.tr || 0;
                    list['sumJmlPetaniPekebun'] = list['sumJmlPetaniPekebun'] ? list['sumJmlPetaniPekebun'] + i.jmlPetaniPekebun : i.jmlPetaniPekebun || 0;
                    list['sumProduktivitas'] = list['sumProduktivitas'] ? list['sumProduktivitas'] + i.produktivitas : i.produktivitas || 0;
                    list['sumProduksi'] = list['sumProduksi'] ? list['sumProduksi'] + i.produksi : i.produksi || 0;

                    let pos = i.masterKategoriKomoditasId;

                    list[pos] = list[pos] || {};

                    list[pos]['kategori'] = i?.kategoriKomoditas?.nama || 'error';
                    list[pos]['sumJumlah'] = list[pos]['sumJumlah'] ? list[pos]['sumJumlah'] + i.jumlah : i.jumlah || 0;
                    list[pos]['sumTbm'] = list[pos]['sumTbm'] ? list[pos]['sumTbm'] + i.tbm : i.tbm || 0;
                    list[pos]['sumTm'] = list[pos]['sumTm'] ? list[pos]['sumTm'] + i.tm : i.tm || 0;
                    list[pos]['sumTr'] = list[pos]['sumTr'] ? list[pos]['sumTr'] + i.tr : i.tr || 0;
                    list[pos]['sumJmlPetaniPekebun'] = list[pos]['sumJmlPetaniPekebun'] ? list[pos]['sumJmlPetaniPekebun'] + i.jmlPetaniPekebun : i.jmlPetaniPekebun || 0;
                    list[pos]['sumProduktivitas'] = list[pos]['sumProduktivitas'] ? list[pos]['sumProduktivitas'] + i.produktivitas : i.produktivitas || 0;
                    list[pos]['sumProduksi'] = list[pos]['sumProduksi'] ? list[pos]['sumProduksi'] + i.produksi : i.produksi || 0;

                    list[pos]['masterIds'] = list[pos]['masterIds'] || [];

                    if (!list[pos]['masterIds'].includes(i.komoditas.id)) {
                        list[pos]['masterIds'].push(i.komoditas.id);
                    }

                    list[pos]['list'] = list[pos]['list'] || {};
                    list[pos]['list'][i.komoditas.id] = {
                        id: i.id,
                        komoditas: i?.komoditas?.nama || 'error',
                        tbm: i.tbm,
                        tm: i.tm,
                        tr: i.tr,
                        jumlah: i.jumlah,
                        produksi: i.produksi,
                        produktivitas: i.produktivitas,
                        jmlPetaniPekebun: i.jmlPetaniPekebun,
                        bentukHasil: i.bentukHasil,
                        keterangan: i.keterangan,
                    }
                }
                return {
                    tahun: item.tahun,
                    kecamatan: item?.kecamatan?.nama || 'error',
                    list,
                }
            });

            res.status(200).json(response(200, 'Get perkebunan successfully', { data: perkebunanKecamatan, pagination }));
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

            const perkebunanKecamatanList = await PerkebunanKecamatanList.findOne({
                where: { id },
                include: [
                    {
                        model: PerkebunanMasterKategoriKomoditas,
                        as: 'kategoriKomoditas'
                    },
                    {
                        model: PerkebunanMasterKomoditas,
                        as: 'komoditas'
                    },
                ],
            });

            if (!perkebunanKecamatanList) {
                res.status(404).json(response(404, 'Perkebunan not found'));
                return;
            }

            res.status(200).json(response(200, 'Get perkebunan successfully', perkebunanKecamatanList));
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

            const perkebunanKecamatanList = await PerkebunanKecamatanList.findOne({
                where: { id },
            });

            const schema = {
                master_kategori_komoditas_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                master_komoditas_id: {
                    type: "number",
                    optional: true,
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

            if (!perkebunanKecamatanList) {
                res.status(404).json(response(404, 'Perkebunan not found'));
                return;
            }

            let {
                master_kategori_komoditas_id,
                master_komoditas_id,
                tbm,
                tm,
                tr,
                produksi,
                produktivitas,
                jml_petani_pekebun,
                bentuk_hasil,
                keterangan,
            } = req.body;

            if (master_komoditas_id) {
                const masterKomoditas = await PerkebunanMasterKomoditas.findByPk(master_komoditas_id);

                if (!masterKomoditas) {
                    res.status(400).json(response(400, 'Bad Request', [
                        {
                            type: 'notFound',
                            message: "Master komoditas doesn't exists",
                            field: 'master_komoditas_id',
                        },
                    ]));
                    return;
                }
            } else {
                master_komoditas_id = perkebunanKecamatanList.masterKomoditasId;
            }

            if (master_kategori_komoditas_id) {
                const masterKategoriKomoditas = await PerkebunanMasterKategoriKomoditas.findByPk(master_kategori_komoditas_id);

                if (!masterKategoriKomoditas) {
                    res.status(400).json(response(400, 'Bad Request', [
                        {
                            type: 'notFound',
                            message: "Master kategori komoditas doesn't exists",
                            field: 'master_kategori_komoditas_id',
                        },
                    ]));
                    return;
                }
            } else {
                master_kategori_komoditas_id = perkebunanKecamatanList.masterKategoriKomoditasId;
            }

            let jumlah = 0;
            for (let temp of [
                tbm,
                tm,
                tr,
            ]) {
                if (temp) {
                    jumlah += temp;
                }
            }

            await perkebunanKecamatanList.update({
                masterKategoriKomoditasId: master_kategori_komoditas_id,
                masterKomoditasId: master_komoditas_id,
                tbm,
                tm,
                tr,
                jumlah,
                produksi,
                produktivitas,
                jmlPetaniPekebun: jml_petani_pekebun,
                bentukHasil: bentuk_hasil,
                keterangan,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update perkebunan successfully'));
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

            const perkebunanKecamatanList = await PerkebunanKecamatanList.findOne({
                where: { id },
            });

            if (!perkebunanKecamatanList) {
                res.status(404).json(response(404, 'Perkebunan not found'));
                return;
            }

            const perkebunanKecamatanId = perkebunanKecamatanList.perkebunanKecamatanId;

            await perkebunanKecamatanList.destroy();

            const perkebunanKecamatanListExists = await PerkebunanKecamatanList.findOne({
                where: { perkebunanKecamatanId }
            });

            if (!perkebunanKecamatanListExists) {
                await PerkebunanKecamatan.destroy({
                    where: { id: perkebunanKecamatanId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Delete perkebunan successfully'));
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