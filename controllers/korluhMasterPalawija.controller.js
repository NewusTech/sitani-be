const { KorluhMasterPalawija } = require('../models');
const logger = require('../errorHandler/logger');
const Validator = require("fastest-validator");
const { response } = require('../helpers');
const { Op } = require('sequelize');

const v = new Validator();

module.exports = {
    getAll: async (req, res) => {
        try {
            const korluhMasterPalawija = await KorluhMasterPalawija.findAll({
                where: {
                    hide: { [Op.ne]: true }
                }
            });

            res.status(200).json(response(200, 'Berhasil mendapatkan daftar korluh master palawija', korluhMasterPalawija));
        } catch (err) {
            console.log(err);

            logger.error(`Error : ${err}`);
            logger.error(`Error message: ${err.message}`);

            // res.status(500).json(response(500, 'Internal server error'));
            res.status(500).json(response(500, err.message));
        }
    },
}