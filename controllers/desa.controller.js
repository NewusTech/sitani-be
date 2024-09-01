const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Desa } = require('../models');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
			let { kecamatan } = req.query;

            let where = {};

            if (kecamatan && !isNaN(parseInt(kecamatan))) {
                where.kecamatanId = parseInt(kecamatan);
            }

            const desa = await Desa.findAll({ where });

            res.status(200).json(response(200, 'Get desa successfully', desa));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            res.status(500).json(response(500, 'Internal server error'));
        }
    },
}