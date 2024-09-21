const { TphRealisasiPalawija1, TphRealisasiPalawija2, TphLahanBukanSawah, TphRealisasiPadi, TphLahanSawah, sequelize } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    lahanBukanSawah: async (req, res) => {
        try {
            let tahun = await TphLahanBukanSawah.findAll({
                order: [['tahun', 'DESC']],
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun tph lahan bukan sawah successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    lahanSawah: async (req, res) => {
        try {
            let tahun = await TphLahanSawah.findAll({
                order: [['tahun', 'DESC']],
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun tph lahan sawah successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    realisasiPadi: async (req, res) => {
        try {
            let tahun = await TphRealisasiPadi.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('bulan'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun tph realisasi padi successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    realisasiPalawija1: async (req, res) => {
        try {
            let tahun = await TphRealisasiPalawija1.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('bulan'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun tph realisasi palawija 1 successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },

    realisasiPalawija2: async (req, res) => {
        try {
            let tahun = await TphRealisasiPalawija2.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.fn('YEAR', sequelize.col('bulan'))), 'tahun'],
                ],
                order: [['tahun', 'DESC']],
                raw: true,
            });

            tahun = tahun.map(item => item.tahun);

            res.status(200).json(response(200, 'Get tahun tph realisasi palawija 2 successfully', tahun));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}