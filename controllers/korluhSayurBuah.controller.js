const { KorluhMasterSayurBuah, KorluhSayurBuahList, KorluhSayurBuah, Kecamatan, User, sequelize } = require('../models');
const { customMessages, dateGenerate, fixedNumber, response } = require('../helpers');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages
});

const coreSchema = {
    hasil_produksi: {
        type: "string",
        optional: true,
    },
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
                korluh_master_sayur_buah_id: {
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
                korluh_master_sayur_buah_id,
                kecamatan_id,
                tanggal,
                hasil_produksi,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga,
                keterangan,
            } = req.body;

            const korluhMasterSayurBuah = await KorluhMasterSayurBuah.findByPk(korluh_master_sayur_buah_id);
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
            if (!korluhMasterSayurBuah) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Korluh master sayur dan buah tidak dapat ditemukan",
                        field: 'korluh_master_sayur_buah_id',
                    },
                ]));
                return;
            }

            tanggal = dateGenerate(tanggal);

            const korluhSayurBuah = await KorluhSayurBuah.findOrCreate({
                where: {
                    tanggal: { [Op.eq]: tanggal },
                    kecamatanId: kecamatan.id,
                },
                defaults: {
                    kecamatanId: kecamatan.id,
                    tanggal,
                }
            });

            const korluhSayurBuahListExists = await KorluhSayurBuahList.findOne({
                where: {
                    korluhMasterSayurBuahId: korluhMasterSayurBuah.id,
                    korluhSayurBuahId: korluhSayurBuah[0].id,
                }
            });

            if (korluhSayurBuahListExists) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'duplicate',
                        message: "Tidak dapat menambahkan korluh sayur dan buah, master sudah digunakan",
                        field: 'korluh_master_sayur_buah_id',
                    },
                ]));
                await transaction.rollback();
                return;
            }

            await KorluhSayurBuahList.create({
                korluhMasterSayurBuahId: korluhMasterSayurBuah.id,
                korluhSayurBuahId: korluhSayurBuah[0].id,
                hasilProduksi: hasil_produksi,
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

            res.status(201).json(response(201, 'Berhasil menambahkan korluh sayur dan buah'));
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

            let korluhSayurBuah = await KorluhSayurBuah.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: KorluhSayurBuahList,
                        as: 'list',
                        include: [
                            {
                                model: KorluhMasterSayurBuah,
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

            const count = await KorluhSayurBuah.count({ where });

            limit = limit || 1;

            const pagination = generatePagination(count, page, limit, '/api/korluh/sayur-buah/get');

            korluhSayurBuah = korluhSayurBuah.map(item => {
                let temp = {
                    masterIds: [],
                };
                item.list.forEach(i => {
                    const idx = i.master.id;

                    temp[idx] = {
                        master: i.master,
                    };
                    for (let idxVal of [
                        "hasilProduksi",
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
                    tanggal: item.tanggal,
                    desaId: item.desaId,

                    kecamatan: item?.kecamatan,
                    desa: item?.desa,

                    ...temp,
                };
            });

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar korluh sayur dan buah', { data: korluhSayurBuah, pagination }));
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

            const korluhSayurBuahList = await KorluhSayurBuahList.findOne({
                where: { id },
                include: [
                    {
                        model: KorluhSayurBuah,
                        as: 'korluhSayurBuah',
                        include: [
                            {
                                model: Kecamatan,
                                as: 'kecamatan',
                            },
                        ],
                    },
                    {
                        model: KorluhMasterSayurBuah,
                        as: 'master'
                    }
                ],
            });

            if (!korluhSayurBuahList) {
                res.status(404).json(response(404, 'Korluh sayur dan buah tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan korluh sayur dan buah', korluhSayurBuahList));
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

            const korluhSayurBuahList = await KorluhSayurBuahList.findOne({
                where: { id },
            });

            const schema = {
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!korluhSayurBuahList) {
                res.status(404).json(response(404, 'Korluh sayur dan buah tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            const korluhSayurBuah = await KorluhSayurBuah.findByPk(korluhSayurBuahList.korluhSayurBuahId);

            if (!korluhSayurBuah) {
                res.status(404).json(response(404, 'Korluh sayur dan buah tidak sesuai'));
                return;
            }

            let {
                hasil_produksi,
                luas_panen_habis,
                luas_panen_belum_habis,
                luas_rusak,
                luas_penanaman_baru,
                produksi_habis,
                produksi_belum_habis,
                rerata_harga,
                keterangan,
            } = req.body;

            await korluhSayurBuahList.update({
                hasilProduksi: hasil_produksi,
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

            res.status(200).json(response(200, 'Berhasil memperbaharui korluh sayur dan buah'));
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

            const korluhSayurBuahList = await KorluhSayurBuahList.findOne({
                where: { id },
            });

            if (!korluhSayurBuahList) {
                res.status(404).json(response(404, 'Korluh sayur dan buah tidak dapat ditemukan'));
                return;
            }

            const korluhSayurBuahId = korluhSayurBuahList.korluhSayurBuahId;

            const korluhSayurBuah = await KorluhSayurBuah.findByPk(korluhSayurBuahId);

            if (!korluhSayurBuah) {
                res.status(404).json(response(404, 'Korluh sayur dan buah tidak sesuai'));
                return;
            }

            await korluhSayurBuahList.destroy();

            const korluhSayurBuahExits = await KorluhSayurBuahList.findOne({
                where: { korluhSayurBuahId }
            });

            if (!korluhSayurBuahExits) {
                await KorluhSayurBuah.destroy({
                    where: { id: korluhSayurBuahId }
                });
            }

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus korluh sayur dan buah'));
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