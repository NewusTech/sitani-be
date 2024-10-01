const { PerkebunanMasterKategoriKomoditas } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            const kepangMasterKomoditas = await PerkebunanMasterKategoriKomoditas.findAll({
                order: [['id', 'ASC']]
            });

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar perkebunan master kategori komoditi', kepangMasterKomoditas));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}