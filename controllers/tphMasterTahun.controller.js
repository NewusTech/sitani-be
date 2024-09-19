const { TphLahanBukanSawah, TphLahanSawah, sequelize } = require('../models');
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
}