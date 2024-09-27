const { PenyuluhKelompokTani, Kecamatan, Desa, sequelize } = require('../models');
const { generatePagination } = require('../pagination/pagination');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

const coreSchema = {
    nama: {
        type: "string",
        max: 255,
        min: 1,
    },
    ketua: {
        type: "string",
        max: 255,
        min: 1,
    },
    sekretaris: {
        type: "string",
        max: 255,
        min: 1,
    },
    bendahara: {
        type: "string",
        max: 255,
        min: 1,
    },
    alamat: {
        type: "string",
        max: 255,
        min: 1,
    },
    dibent: {
        type: "number",
        integer: true,
        convert: true,
        min: 1111,
        max: 9999,
    },
    l: {
        type: "number",
        integer: true,
        convert: true,
    },
    p: {
        type: "number",
        integer: true,
        convert: true,
    },
    kelas: {
        type: "enum",
        values: ['p', 'l', 'm', 'u']
    },
};

module.exports = {
    create: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const schema = {
                id_poktan: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
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
                id_poktan,
                kecamatan_id,
                desa_id,
                tahun,
                nama,
                ketua,
                sekretaris,
                bendahara,
                alamat,
                dibent,
                l,
                p,
                kelas,
            } = req.body;

            const kecamatan = await Kecamatan.findByPk(kecamatan_id);
            const desa = await Desa.findByPk(desa_id);

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

            await PenyuluhKelompokTani.create({
                kecamatanId: kecamatan_id,
                idPoktan: id_poktan,
                desaId: desa_id,
                sekretaris,
                bendahara,
                alamat,
                dibent,
                kelas,
                ketua,
                tahun,
                nama,
                l,
                p,
            });

            await transaction.commit();

            res.status(201).json(response(201, 'Penyuluh kelompok tani created'));
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
                        sekretaris: { [Op.like]: `%${search}%` },
                        id_poktan: { [Op.like]: `%${search}%` },
                        bendahara: { [Op.like]: `%${search}%` },
                        alamat: { [Op.like]: `%${search}%` },
                        dibent: { [Op.like]: `%${search}%` },
                        kelas: { [Op.like]: `%${search}%` },
                        ketua: { [Op.like]: `%${search}%` },
                        tahun: { [Op.like]: `%${search}%` },
                        nama: { [Op.like]: `%${search}%` },
                        l: { [Op.like]: `%${search}%` },
                        p: { [Op.like]: `%${search}%` },
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

            const penyuluhKelompokTani = await PenyuluhKelompokTani.findAll({
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

            const count = await PenyuluhKelompokTani.count({ where });

            const pagination = generatePagination(count, page, limit, '/api/penyuluh-kelompok-tani/get');

            res.status(200).json(response(200, 'Get penyuluh kelompok tani successfully', { data: penyuluhKelompokTani, pagination }));
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

            const penyuluhKelompokTani = await PenyuluhKelompokTani.findOne({
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

            if (!penyuluhKelompokTani) {
                res.status(404).json(response(404, 'Penyuluh kelompok tani not found'));
                return;
            }

            res.status(200).json(response(200, 'Get penyuluh kelompok tani successfully', penyuluhKelompokTani));
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

            const penyuluhKelompokTani = await PenyuluhKelompokTani.findOne({
                where: { id },
            });

            const schema = {
                id_poktan: {
                    type: "number",
                    positive: true,
                    integer: true,
                    convert: true,
                },
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

            if (!penyuluhKelompokTani) {
                res.status(404).json(response(404, 'Penyuluh kelompok tani not found'));
                return;
            }

            if (validate.length > 0) {
                res.status(400).json(response(400, 'Bad Request', validate));
                return;
            }

            let {
                id_poktan,
                kecamatan_id,
                desa_id,
                tahun,
                nama,
                ketua,
                sekretaris,
                bendahara,
                alamat,
                dibent,
                l,
                p,
                kelas,
            } = req.body;

            if (kecamatan_id) {
                const kecamatan = await Kecamatan.findByPk(kecamatan_id);

                kecamatan_id = kecamatan?.id ?? penyuluhKelompokTani.kecamatanId;
            } else {
                kecamatan_id = penyuluhKelompokTani.kecamatanId;
            }

            if (desa_id) {
                const desa = await Desa.findByPk(desa_id);

                desa_id = desa?.id ?? penyuluhKelompokTani.desaId;
            } else {
                desa_id = penyuluhKelompokTani.desaId;
            }

            id_poktan = id_poktan ?? penyuluhKelompokTani.idPoktan;
            tahun = tahun ?? penyuluhKelompokTani.tahun;
            nama = nama ?? penyuluhKelompokTani.nama;
            ketua = ketua ?? penyuluhKelompokTani.ketua;
            sekretaris = sekretaris ?? penyuluhKelompokTani.sekretaris;
            bendahara = bendahara ?? penyuluhKelompokTani.bendahara;
            alamat = alamat ?? penyuluhKelompokTani.alamat;
            dibent = dibent ?? penyuluhKelompokTani.dibent;
            l = l ?? penyuluhKelompokTani.l;
            p = p ?? penyuluhKelompokTani.p;
            kelas = kelas ?? penyuluhKelompokTani.kelas;

            await penyuluhKelompokTani.update({
                kecamatanId: kecamatan_id,
                idPoktan: id_poktan,
                desaId: desa_id,
                sekretaris,
                bendahara,
                alamat,
                dibent,
                kelas,
                ketua,
                tahun,
                nama,
                l,
                p,
            });

            await transaction.commit();

            res.status(200).json(response(200, 'Update penyuluh kelompok tani successfully'));
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

            const penyuluhKelompokTani = await PenyuluhKelompokTani.findOne({
                where: { id },
            });

            if (!penyuluhKelompokTani) {
                res.status(404).json(response(404, 'Penyuluh kelompok tani not found'));
                return;
            }

            await penyuluhKelompokTani.destroy();

            await transaction.commit();

            res.status(200).json(response(200, 'Delete penyuluh kelompok tani successfully'));
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