const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Kecamatan } = require('../models');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            const kecamatan = await Kecamatan.findAll();

            res.status(200).json(response(200, 'Get kecamatan successfully', kecamatan));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error'));
        }
    },
}