const { PerkebunanMasterKomoditas } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            let { kategori } = req.query;

            let where = {};
            if (!isNaN(parseInt(kategori))) {
                where.perkebunanMasterKategoriId = parseInt(kategori);
            }

            const kepangMasterKomoditas = await PerkebunanMasterKomoditas.findAll({
                order: [['id', 'ASC']],
                where,
            });

            res.status(200).json(response(200, 'Get perkebunan master komoditi successfully', kepangMasterKomoditas));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}