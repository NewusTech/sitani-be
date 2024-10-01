const { PenyuluhKecamatan, PenyuluhKabupaten, Kecamatan, Desa, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    get: async (req, res) => {
        try {
            let { limit } = req.query;

            limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);

            const penyuluhKabupaten = await PenyuluhKabupaten.findAll({
                include: [
                    {
                        model: Kecamatan,
                        as: 'kecamatan',
                    },
                ],
                limit,
            });
            const penyuluhKecamatan = await PenyuluhKecamatan.findAll({
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
                limit,
            });

            const penyuluhKabupatenCount = await PenyuluhKabupaten.count();
            const penyuluhKecamatanCount = await PenyuluhKecamatan.count();

            res.status(200).json(response(200, 'Berhasil mendapatkan data dashboard penyuluh', {
                penyuluhKabupatenCount,
                penyuluhKecamatanCount,
                penyuluhKabupaten,
                penyuluhKecamatan,
            }));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}