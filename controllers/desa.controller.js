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

            const desa = await Desa.findAll({
                where,
                order: [['nama', 'ASC']]
            });

            res.status(200).json(response(200, 'Get desa successfully', desa));
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

            const desa = await Desa.findByPk(id);

            if (!desa) {
                res.status(404).json(response(404, 'Desa not found'));
                return;
            }

            res.status(200).json(response(200, 'Get desa successfully', desa));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}