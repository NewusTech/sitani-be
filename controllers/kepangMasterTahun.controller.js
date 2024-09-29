const { KepangPedagangEceran, KepangProdusenEceran, KepangCvProduksi, KepangCvProdusen, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    perbandinganHarga: async (req, res) => {
        try {
            let tahun = await KepangPedagangEceran.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('tanggal'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun kepang perbandingan harga successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    produsenEceran: async (req, res) => {
        try {
            let tahun = await KepangProdusenEceran.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('tanggal'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun kepang produsen eceran successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    cvProduksi: async (req, res) => {
        try {
            let tahun = await KepangCvProduksi.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('bulan'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun kepang cv produksi successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    cvProdusen: async (req, res) => {
        try {
            let tahun = await KepangCvProdusen.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('bulan'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun kepang cv produsen successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}