const { KorluhMasterTanamanHias } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            const korluhMasterTanamanHias = await KorluhMasterTanamanHias.findAll();

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar korluh master tanaman hias', korluhMasterTanamanHias));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}