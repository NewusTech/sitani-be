const { PenyuluhGabunganKelompokTani, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const { customMessages, response } = require('../helpers');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { Op } = require('sequelize');

const v = new Validator({
    messages: customMessages,
});

const getSum = (arr) => {
    sum = 0;
    for (let x of arr) {
        if (x) {
            sum += Number(x);
        }
    }
    return sum;
};

const coreSchema = {
    nama: {
        type: 'string',
        optional: true,
        max: 255,
        min: 1,
    },
    ketua: {
        type: 'string',
        optional: true,
        max: 255,
        min: 1,
    },
    sekretaris: {
        type: 'string',
        optional: true,
        max: 255,
        min: 1,
    },
    bendahara: {
        type: 'string',
        optional: true,
        max: 255,
        min: 1,
    },
    alamat: {
        type: 'string',
        optional: true,
        max: 255,
        min: 1,
    },
    lahan: {
        type: 'number',
        optional: true,
        positive: true,
        convert: true,
    },
    dibentuk: {
        type: 'number',
        optional: true,
        convert: true,
        integer: true,
        min: 1111,
        max: 9999,
    },
    poktan: {
        type: 'number',
        optional: true,
        positive: true,
        convert: true,
        integer: true,
    },
    l: {
        type: 'number',
        optional: true,
        positive: true,
        convert: true,
        integer: true,
    },
    p: {
        type: 'number',
        optional: true,
        positive: true,
        convert: true,
        integer: true,
    },
};

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
                tahun: {
                    type: "number",
                    integer: true,
                    convert: true,
                    min: 1111,
                    max: 9999,
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
                tahun,
                nama,
                ketua,
                sekretaris,
                bendahara,
                alamat,
                lahan,
                dibentuk,
                poktan,
                l,
                p,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

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
            if (!desa) {
                res.status(400).json(response(400, 'Bad Request', [
                    {
                        type: 'notFound',
                        message: "Desa tidak dapat ditemukan",
                        field: 'desa_id',
                    },
                ]));
                return;
            }

            await PenyuluhGabunganKelompokTani.create({
                kecamatanId: kecamatan_id,
                desaId: desa_id,
                tahun,
                total: getSum([l, p]),
                sekretaris,
                bendahara,
                dibentuk,
                alamat,
                poktan,
                ketua,
                lahan,
                nama,
                l,
                p,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Berhasil menambahkan penyuluh gabungan kelompok tani'));
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
            let { kecamatan, search, limit, tahun, page, desa } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            page = isNaN(parseInt(page)) ? 1 : parseInt(page);

            kecamatan = isNaN(parseInt(kecamatan)) ? null : parseInt(kecamatan);
            tahun = isNaN(parseInt(tahun)) ? null : parseInt(tahun);
            desa = isNaN(parseInt(desa)) ? null : parseInt(desa);

            const offset = (page - 1) * limit;

            let where = {};
            if (search) {
                where = {
                    [Op.or]: {
                        nama: { [Op.like]: `%${search}%` },
                        ketua: { [Op.like]: `%${search}%` },
                        sekretaris: { [Op.like]: `%${search}%` },
                        bendahara: { [Op.like]: `%${search}%` },
                        alamat: { [Op.like]: `%${search}%` },
                        lahan: { [Op.like]: `%${search}%` },
                        dibentuk: { [Op.like]: `%${search}%` },
                        poktan: { [Op.like]: `%${search}%` },
                        l: { [Op.like]: `%${search}%` },
                        p: { [Op.like]: `%${search}%` },
                        total: { [Op.like]: `%${search}%` },
                    }
                };
            }
            if (kecamatan) {
                where.kecamatanId = kecamatan;
            }
            if (desa) {
                where.desaId = desa;
            }
            if (tahun) {
                where.tahun = tahun;
            }

            const penyuluhGabunganKelompokTani = await PenyuluhGabunganKelompokTani.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
                offset,
                limit,
                where,
            });

            const count = await PenyuluhGabunganKelompokTani.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/penyuluh-gabungan-kelompok-tani/get');

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar penyuluh gabungan kelompok tani', { data: penyuluhGabunganKelompokTani, pagination }));
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

            const penyuluhGabunganKelompokTani = await PenyuluhGabunganKelompokTani.findOne({
                where: { id },
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                    {
                        model: Desa,
                        as: 'desa',
                    },
                ],
            });

            if (!penyuluhGabunganKelompokTani) {
                res.status(404).json(response(404, 'Penyuluh gabungan kelompok tani tidak dapat ditemukan'));
                return;
            }

            res.status(200).json(response(200, 'Berhasil mendapatkan penyuluh gabungan kelompok tani', penyuluhGabunganKelompokTani));
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

            const penyuluhGabunganKelompokTani = await PenyuluhGabunganKelompokTani.findOne({
                where: { id },
            });

            const schema = {
                kecamatan_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                desa_id: {
                    type: "number",
                    optional: true,
                    positive: true,
                    integer: true,
                    convert: true,
                },
                tahun: {
                    type: "number",
                    optional: true,
                    integer: true,
                    convert: true,
                    min: 1111,
                    max: 9999,
                },
                ...coreSchema,
            };

            const validate = v.validate(req.body, schema);

            if (!penyuluhGabunganKelompokTani) {
                res.status(404).json(response(404, 'Penyuluh gabungan kelompok tani tidak dapat ditemukan'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                kecamatan_id,
                desa_id,
                tahun,
                nama,
                ketua,
                sekretaris,
                bendahara,
                alamat,
                lahan,
                dibentuk,
                poktan,
                l,
                p,
            } = req.body;

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? penyuluhGabunganKelompokTani.kecamatanId;
            } else {
                kecamatan_id = penyuluhGabunganKelompokTani.kecamatanId;
            }

            if (desa_id) {
                const desa = await Desa.findByPk(desa_id);

                desa_id = desa?.id ?? penyuluhGabunganKelompokTani.desaId;
            } else {
                desa_id = penyuluhGabunganKelompokTani.desaId;
            }

            tahun = tahun ?? penyuluhGabunganKelompokTani.tahun;
            sekretaris = sekretaris ?? penyuluhGabunganKelompokTani.sekretaris;
            bendahara = bendahara ?? penyuluhGabunganKelompokTani.bendahara;
            dibentuk = dibentuk ?? penyuluhGabunganKelompokTani.dibentuk;
            alamat = alamat ?? penyuluhGabunganKelompokTani.alamat;
            poktan = poktan ?? penyuluhGabunganKelompokTani.poktan;
            ketua = ketua ?? penyuluhGabunganKelompokTani.ketua;
            lahan = lahan ?? penyuluhGabunganKelompokTani.lahan;
            nama = nama ?? penyuluhGabunganKelompokTani.nama;
            l = l ?? penyuluhGabunganKelompokTani.l;
            p = p ?? penyuluhGabunganKelompokTani.p;

            await penyuluhGabunganKelompokTani.update({
                kecamatanId: kecamatan_id,
                desaId: desa_id,
                tahun,
                total: getSum([l, p]),
                sekretaris,
                bendahara,
                dibentuk,
                alamat,
                poktan,
                ketua,
                lahan,
                nama,
                l,
                p,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil memperbaharui penyuluh gabungan kelompok tani'));
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

            const penyuluhGabunganKelompokTani = await PenyuluhGabunganKelompokTani.findOne({
                where: { id },
            });

            if (!penyuluhGabunganKelompokTani) {
                res.status(404).json(response(404, 'Penyuluh gabungan kelompok tani tidak dapat ditemukan'));
                return;
            }

            await penyuluhGabunganKelompokTani.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Berhasil menghapus penyuluh gabungan kelompok tani'));
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