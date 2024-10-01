const { PerkebunanKecamatan, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    kecamatan: async (req, res) => {
        try {
            let tahun = await PerkebunanKecamatan.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('tahun')), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar tahun perkebunan kecamatan', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}